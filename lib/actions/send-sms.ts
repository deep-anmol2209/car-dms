'use server';

import { createClient } from '@/lib/supabase/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client (only if credentials are available)
const twilioClient = accountSid && authToken 
  ? twilio(accountSid, authToken)
  : null;

export async function sendLeadSms(leadId: string, message: string) {
  const supabase = await createClient();

  // Fetch lead with customer
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select(`
      *,
      customer:customers(phone)
    `)
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  const phoneNumber = lead.customer?.phone;
  if (!phoneNumber) {
    throw new Error('No phone number found for this lead');
  }

  // Send SMS via Twilio (or mock if not configured)
  let smsResult;
  if (twilioClient && fromNumber) {
    try {
      smsResult = await twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber,
      });
    } catch (error: any) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  } else {
    // Mock SMS for development
    console.log(`[MOCK SMS] To: ${phoneNumber}, Message: ${message}`);
    smsResult = { sid: `mock_${Date.now()}`, status: 'queued' };
  }

  // Save interaction to database
  const { error: interactionError } = await supabase
    .from('interactions')
    .insert({
      lead_id: leadId,
      type: 'sms',
      direction: 'outbound',
      content: message,
      metadata: {
        twilio_sid: smsResult.sid,
        status: smsResult.status,
      },
      created_at: new Date().toISOString(),
    });

  if (interactionError) {
    console.error('Failed to save interaction:', interactionError);
    // Don't throw - SMS was sent, just logging failed
  }

  // Update lead's last engagement
  await supabase
    .from('leads')
    .update({ last_engagement: new Date().toISOString() })
    .eq('id', leadId);

  return {
    success: true,
    messageId: smsResult.sid,
  };
}
