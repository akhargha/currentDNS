# currentDNS

Full-stack DNS identity monitoring product with:
- React + Vite + DaisyUI frontend
- FastAPI backend
- Supabase (Postgres) data layer
- SendGrid emails
- DNS TXT verification and periodic monitoring

## 1) Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run:
   - `supabase/schema.sql`
3. Copy:
   - Project URL
   - Service role key

## 2) Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set values in `backend/.env`:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENDGRID_API_KEY` (optional, but required for real emails)
- `SENDGRID_FROM_EMAIL`
- `CORS_ORIGINS` (frontend URL)

Run backend:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend health:
- `GET http://localhost:8000/health`
- OpenAPI: `http://localhost:8000/docs`

## 3) Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Set `frontend/.env`:
- `VITE_API_BASE_URL=http://localhost:8000`

## 4) Product flow implemented

- Signup with email + domain
- Domain match check (matched vs alternate email)
- Alternate-email DNS TXT verification (`_verifydns.<domain>`)
- Monitoring frequency setup
- OTP login via email
- Dashboard summary + manual scan
- Integration detection:
  - Bluesky: `_atproto.<domain>` contains `did=`
  - Keybase: `<domain>` TXT contains `keybase-site-verification=`
  - GitHub org: `_gh-<org>-o.<domain>` TXT record exists
- Timeline from integration events
- Monitoring settings update
- Periodic scans via APScheduler
- Broken-proof alert email events

## 5) Notes

- Backend auth is custom OTP + opaque bearer session token.
- Scheduler runs inside the backend process.
- Use HTTPS and stronger operational controls before production deployment.
