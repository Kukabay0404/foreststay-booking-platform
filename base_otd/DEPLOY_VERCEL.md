# Deploy Frontend to Vercel

## 1) Push repository to GitHub
Vercel deploys from Git repositories, so first push `a:\b_otd` to GitHub/GitLab/Bitbucket.

## 2) Create project in Vercel
1. Open Vercel dashboard: https://vercel.com/new
2. Import your repository.
3. Set `Root Directory` to `base_otd`.
4. Framework preset should be detected as `Next.js`.

## 3) Configure environment variables
In `Project Settings -> Environment Variables`, add:

- `NEXT_PUBLIC_BACKEND_URL` = your backend public URL (example: `https://api.example.com`)
- `NEXT_PUBLIC_MEDIA_BASE_URL` = your R2 public base URL (example: `https://<public-bucket>.r2.dev`)

Add variables at least for `Production` and `Preview`.

## 4) Deploy
Click `Deploy`.

After deployment, check:
- Main page loads.
- Admin login works.
- API requests go to the correct backend URL (browser Network tab).

## Notes
- Local `.env.local` is not used by Vercel automatically; values must be added in Vercel settings.
- If backend uses CORS, allow your Vercel domain (for example `https://<project>.vercel.app` and your custom domain).
