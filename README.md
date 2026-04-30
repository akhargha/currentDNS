# currentDNS Deployment (Free Render)

This repo can be deployed for free on Render while keeping the current frontend and backend behavior unchanged.

## Architecture

- Frontend: React + Vite static site (`frontend`)
- Backend: FastAPI web service (`backend`)
- Data/Auth storage: Supabase
- Email delivery: SendGrid

## Important free-tier note

Render free web services can sleep after inactivity, so the first API request after idle time may be slow (cold start).

## One-time prerequisites

1. Push this repository to GitHub.
2. Have existing credentials ready:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`

## Deploy with `render.yaml` (recommended)

The repo includes a Render blueprint file at `render.yaml`.

1. Go to [https://render.com](https://render.com) and sign in.
2. Click **New** -> **Blueprint**.
3. Connect your GitHub account/repository.
4. Select this repo and deploy.
5. Render will create:
   - `currentdns-api` (Python web service)
   - `currentdns-frontend` (static site)

## Configure backend environment variables

Open the `currentdns-api` service in Render and set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `CORS_ORIGINS` (set this to your frontend Render URL, for example `https://currentdns-frontend.onrender.com`)

Optional variables (defaults already exist in code):

- `APP_NAME`
- `APP_ENV` (set to `production` by blueprint)
- `SESSION_TTL_HOURS`
- `OTP_TTL_MINUTES`
- `OTP_CODE_LENGTH`
- `SCHEDULER_POLL_MINUTES`

## Configure frontend environment variable

Open the `currentdns-frontend` service in Render and set:

- `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com`

Then trigger a redeploy for the static site.

## Verify deployment

1. Backend health check:
   - Open `https://<your-backend-service>.onrender.com/api/health`
   - Expect: `{"status":"ok"}`
2. Open frontend URL from Render.
3. Test core flows:
   - sign up / login
   - OTP email delivery and verification
   - dashboard loads
   - settings/integration checks run

## Manual setup (if you do not use blueprint)

### Backend (`currentdns-api`)

- Type: **Web Service**
- Runtime: **Python**
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/api/health`
- Plan: **Free**

### Frontend (`currentdns-frontend`)

- Type: **Static Site**
- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Plan: not set in Blueprint (Render static-site pricing applies automatically)

Set the same environment variables described above.
