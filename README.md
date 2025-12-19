# Logistics Lingo SaaS

A Next.js application for generating professional logistics and freight communication messages using AI.

## Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (package manager - install with `npm install -g pnpm`)
- **Supabase account** (for authentication and database)
- **Stripe account** (for payments)
- **OpenAI API key** (for AI message generation)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom redirect URL for development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### 3. Set Up Supabase Database

Run the SQL scripts in the `scripts/` directory to set up your database schema:

1. `001_create_tables.sql` - Creates the necessary tables (profiles, message_history, saved_templates)
2. `002_create_profile_trigger.sql` - Creates a trigger to automatically create profiles for new users
3. `003_create_indexes.sql` - Creates indexes for better query performance

You can run these scripts in your Supabase SQL editor.

### 4. Configure Stripe Webhook

1. Go to your Stripe Dashboard → Developers → Webhooks
2. Add a new endpoint pointing to: `http://localhost:3000/api/stripe-webhook` (or your production URL)
3. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

**Note:** For local development, you'll need to use Stripe CLI to forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

### 5. Run the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server (after building)
- `pnpm lint` - Run ESLint to check for code issues

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - React components and UI components
- `lib/` - Utility functions and configurations (Supabase, Stripe)
- `scripts/` - SQL scripts for database setup
- `public/` - Static assets

## Features

- User authentication with Supabase
- AI-powered message generation for logistics communications
- Subscription management with Stripe
- Message history and saved templates
- Rate limiting for free tier users

## Troubleshooting

### Database Issues
- Ensure all SQL scripts have been run in Supabase
- Check that the `profiles` table has the correct structure
- Verify that the profile trigger is working correctly

### Stripe Webhook Issues
- For local development, use Stripe CLI to forward webhooks
- Ensure the webhook secret matches in your `.env.local`
- Check Stripe dashboard for webhook delivery logs

### OpenAI API Issues
- Verify your API key is correct and has sufficient credits
- Check that the `OPENAI_API_KEY` environment variable is set

## License
// trigger build

Private - All rights reserved



