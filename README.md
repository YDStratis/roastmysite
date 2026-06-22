# 🔥 RoastMySite — AI Website Audit with Attitude

Your website has problems.
We'll find all of them — and roast you for every single one.

## What It Does

Enter any URL. Get back a full AI-powered audit that covers:

- 🧱 Completeness — are the basics even there?
- 🔍 SEO — can Google find you or are you invisible?
- 🎨 UX & Conversion — would anyone actually buy from you?
- ⚡ Performance — is it slow? (it probably is)
- 🔒 Domain Trust — how old, who owns it, is it sketchy?
- 📊 Traffic — does anyone actually visit?
- ⚙️ Tech Stack — what's powering it?
- ⚠️ Risk Signals — missing privacy policy? no contact page?

## Two Modes

### 🔥 Roast Mode
Honest, direct, slightly brutal feedback.
For business owners who want the truth.
Shareable. Funny. Painfully accurate.

### 📋 Pro Report Mode  
Evidence-based, structured audit report.
For agencies, freelancers, and fintech/KYB teams.
PDF export. White-label ready.

## Scoring

| Category | Weight |
|---|---|
| Website Completeness | 25% |
| UX & Conversion | 15% |
| SEO Readiness | 15% |
| Technical Health | 10% |
| Domain Trust | 15% |
| Traffic Strength | 10% |
| Tech & Tracking | 5% |
| Legal & Compliance | 5% |

## Tech Stack

- Backend: ASP.NET Core (.NET 10)
- Frontend: React + Vite
- Database: PostgreSQL
- AI: Anthropic Claude API
- Performance: Google PageSpeed Insights API
- Payments: Stripe
- Deploy: Railway

## Pricing

| Plan | Price | Features |
|---|---|---|
| Free | €0 | Overall score + 3 issues preview |
| Full Report | €19 one-time | Complete audit + PDF |
| Agency | €49/mo | Unlimited scans + white-label |

## Local Development

### Prerequisites
- .NET 10 SDK
- Node.js 20+
- Docker Desktop
- PostgreSQL (via Docker)

### Setup

```bash
# Clone
git clone https://github.com/yourname/roastmysite.git
cd roastmysite

# Start DB
docker-compose up -d

# Backend
cd RoastMySite.API
dotnet restore
dotnet run

# Frontend
cd ../roastmysite-web
npm install
npm run dev
```

### Environment Variables

**Backend** `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=roastmysite;Username=postgres;Password=postgres"
  },
  "Anthropic": {
    "ApiKey": "your-key-here"
  },
  "PageSpeed": {
    "ApiKey": "your-key-here"
  },
  "Stripe": {
    "SecretKey": "your-key-here",
    "WebhookSecret": "your-key-here"
  }
}
```

**Frontend** `.env.local`:
```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your-key-here
```
