import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Verify CRON_SECRET header
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const supabase = await createClient();
    
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    // Find stale leads
    const { data: staleLeads, error: findError } = await supabase
      .from('leads')
      .select('id')
      .eq('status', 'Not Started')
      .lt('created_at', cutoffDate);

    if (findError) {
      throw findError;
    }

    if (!staleLeads || staleLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No stale leads found',
        updated: 0,
      });
    }

    // Update status to 'lost'
    const leadIds = staleLeads.map(lead => lead.id);
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'Lost' })
      .in('id', leadIds);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${leadIds.length} stale leads to 'Lost' status`,
      updated: leadIds.length,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing (remove in production)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Same logic as POST
  return POST(req);
}
