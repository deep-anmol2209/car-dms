// Temporarily disabled - AI chat feature
// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import { tool } from '@ai-sdk/provider-utils';
// import { createClient } from '@/lib/supabase/server';
// import { z } from 'zod';

// Note: Edge runtime may have limitations with OpenAI SDK
// If you encounter issues, remove this line to use Node.js runtime
// export const runtime = 'edge';

// Temporarily disabled - tool API needs fixing for production
/*
const queryDatabaseTool = tool({
  description: 'Query the Adaptus DMS database using SQL SELECT statements. Use this to answer questions about inventory, leads, sales, and other business data.',
  parameters: z.object({
    query: z.string().describe('A safe SQL SELECT query. Only use SELECT statements, never INSERT, UPDATE, DELETE, or DROP.'),
  }),
  execute: async ({ query }) => {
    try {
      // Security: Only allow SELECT statements
      const trimmedQuery = query.trim().toUpperCase();
      if (!trimmedQuery.startsWith('SELECT')) {
        return { error: 'Only SELECT queries are allowed' };
      }

      // Block dangerous keywords
      const dangerousKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
      if (dangerousKeywords.some(keyword => trimmedQuery.includes(keyword))) {
        return { error: 'Query contains forbidden keywords' };
      }

      const supabase = await createClient();
      
      // Parse and execute safe queries based on table name
      // This is a simplified approach - in production, use parameterized queries
      const queryLower = query.toLowerCase();
      
      let data = null;
      let error = null;

      // Route to appropriate table based on query content
      // Note: This is a simplified router - in production, use a proper SQL parser
      if (queryLower.includes('vehicles') || queryLower.includes('vehicle')) {
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*');
        data = vehicles;
        error = vehiclesError;
      } else if (queryLower.includes('leads') || queryLower.includes('lead')) {
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select(`
            *,
            customer:customers(name, phone, email)
          `);
        data = leads;
        error = leadsError;
      } else if (queryLower.includes('invoices') || queryLower.includes('invoice')) {
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('*');
        data = invoices;
        error = invoicesError;
      } else if (queryLower.includes('users') || queryLower.includes('user')) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*');
        data = users;
        error = usersError;
      } else if (queryLower.includes('customers') || queryLower.includes('customer')) {
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*');
        data = customers;
        error = customersError;
      } else {
        return { error: 'Unsupported table in query', data: null };
      }

      if (error) {
        return { error: error.message, data: null };
      }

      return { data, error: null };
    } catch (error: any) {
      return { error: error.message, data: null };
    }
  },
});
*/

export async function POST(req: Request) {
  // Temporarily disabled - tool API needs fixing
  return new Response(
    JSON.stringify({ error: 'AI chat temporarily disabled - being fixed' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );

  /* Original implementation - needs tool API fix
  const { messages } = await req.json();

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await streamText({
    model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
    system: `You are Adaptus Brain, an AI assistant for the Adaptus Dealer Management System. 
You help users query their business data using natural language.

Database Schema:
- vehicles: id, vin, year, make, model, status, purchase_price, retail_price, created_at
- leads: id, customer_id, source, status, vehicle_interest_id, created_at (customer info in customers table)
- customers: id, name, phone, email
- invoices: id, invoice_number, customer_id, total, status, invoice_date
- users: id, full_name, role, email
- sales_deals: id, vehicle_id, customer_id, amount, status, created_at

When users ask questions:
1. Convert their question to a safe SQL SELECT query
2. Use the queryDatabase tool to execute it
3. Explain the results in plain, business-friendly language

Be concise, helpful, and focus on actionable insights.`,
    messages,
    tools: {
      queryDatabase: queryDatabaseTool,
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
  */
}
