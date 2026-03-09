# Adaptus DMS - External Integrations Guide

## Phase 9: AI Agents & External Integrations

### 1. Adaptus Brain (AI Analyst)

**Location:** Floating chat widget on Dashboard

**Features:**
- Natural language database queries
- Real-time data analysis
- Business insights in plain English

**Setup:**
1. Get OpenAI API key from [OpenAI Platform](https://platform.openai.com)
2. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. The chat widget will appear in the bottom-right corner of the dashboard

**Usage Examples:**
- "How many Fords do we have in stock?"
- "Who are the top 3 salespeople this month?"
- "What's our total inventory value?"
- "Show me all leads from last week"

**Security:**
- Only SELECT queries are allowed
- Dangerous SQL keywords are blocked
- Queries are routed to safe table access methods

### 2. SMS Integration (Twilio)

**Location:** Lead detail page → Chat tab

**Features:**
- Send SMS messages to leads
- Message thread view
- Automatic interaction logging

**Setup:**
1. Create a Twilio account at [twilio.com](https://www.twilio.com)
2. Get your credentials:
   - Account SID
   - Auth Token
   - Phone Number
3. Add to `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**Usage:**
1. Navigate to a lead detail page (`/leads/[id]`)
2. Click the "Chat" tab
3. Type your message and click Send
4. Message is sent via SMS and saved to interactions table

**Development Mode:**
- If Twilio credentials are not set, SMS will be mocked (logged to console)
- Messages are still saved to the database for testing

### 3. Facebook Graph API Integration

**Location:** Inventory → Vehicle Actions Menu

**Features:**
- Auto-post vehicles to Facebook Page
- Marketing caption generation
- Image posting support

**Setup:**
1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Get Page Access Token with `pages_manage_posts` permission
3. Add Facebook account in Settings:
   - Go to Settings → Social Media
   - Connect your Facebook Page
   - Enter Page ID and Access Token

**Database Setup:**
- The `facebook_business_account` table stores credentials
- Insert your page credentials:
  ```sql
  INSERT INTO facebook_business_account (page_id, page_name, access_token, is_connected)
  VALUES ('your-page-id', 'Your Page Name', 'your-access-token', true);
  ```

**Usage:**
1. Navigate to Inventory
2. Click the "..." menu on any vehicle row
3. Click "Post to Facebook"
4. Vehicle details are automatically posted with marketing caption

**Post Format:**
- Includes: Year, Make, Model, Price, Odometer, Condition, VIN
- Includes first vehicle image if available
- Auto-generates hashtags

### 4. Automated Stale Lead Cleanup (Cron Job)

**Location:** `/api/cron/cleanup-leads`

**Features:**
- Automatically marks stale leads as 'lost'
- Runs daily at 2 AM
- Protected by CRON_SECRET

**Setup:**
1. Add to `.env.local`:
   ```
   CRON_SECRET=your_random_secret_string
   ```
2. Configure in Vercel:
   - Go to Project Settings → Cron Jobs
   - Add cron job pointing to `/api/cron/cleanup-leads`
   - Set schedule: `0 2 * * *` (2 AM daily)
   - Add header: `Authorization: Bearer ${CRON_SECRET}`

**Logic:**
- Finds leads with status 'not_started'
- Created more than 30 days ago
- Updates status to 'lost'

**Manual Testing:**
```bash
curl -X POST http://localhost:3000/api/cron/cleanup-leads \
  -H "Authorization: Bearer your_cron_secret"
```

## Database Migrations

Run the interactions table migration:
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/20240102_interactions_table.sql
```

## Environment Variables Summary

```env
# Required for AI Chat
OPENAI_API_KEY=sk-...

# Required for SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Required for Cron Jobs
CRON_SECRET=random_secret_string
```

## Troubleshooting

### AI Chat Not Working
- Verify `OPENAI_API_KEY` is set
- Check browser console for errors
- Ensure API route is accessible

### SMS Not Sending
- Verify Twilio credentials are correct
- Check phone number format (must include country code)
- In development, check console for mock SMS logs

### Facebook Post Failing
- Verify Facebook Page Access Token is valid
- Check token has `pages_manage_posts` permission
- Ensure page_id matches your Facebook Page ID
- Check Facebook Business Account is connected in database

### Cron Job Not Running
- Verify `CRON_SECRET` matches in Vercel settings
- Check Vercel cron job configuration
- Review Vercel function logs for errors
