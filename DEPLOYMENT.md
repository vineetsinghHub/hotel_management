# Aura Monorepo Deployment Guide (Phase 5)

## Current state (2026-02-14, post-Sprint 14)

All five phases of the monorepo split are **code-complete**. Physical file
moves and shared workspace packages are in place. However, the **single-
process dev/prod build** is still active for continuity: supervisor runs
one Vite process at `/app/frontend`, which imports from every workspace
package via aliases. This lets every existing URL keep working with zero
downtime.

When you're ready to actually run three independent processes and
deploy them separately, follow the checklist below.

---

## Checklist — activating independent deploys

### 1. Update supervisor to run three Vite processes

Replace the single `frontend` supervisor block with:

```ini
[program:frontend-b2c]
command=yarn workspace @aura/b2c-engine dev --host 0.0.0.0 --port 5173
directory=/app
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/frontend-b2c.out.log
stderr_logfile=/var/log/supervisor/frontend-b2c.err.log

[program:frontend-b2b]
command=yarn workspace @aura/b2b-pms dev --host 0.0.0.0 --port 5174
directory=/app
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/frontend-b2b.out.log
stderr_logfile=/var/log/supervisor/frontend-b2b.err.log

[program:frontend-super]
command=yarn workspace @aura/super-admin dev --host 0.0.0.0 --port 5175
directory=/app
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/frontend-super.out.log
stderr_logfile=/var/log/supervisor/frontend-super.err.log
```

### 2. Give each app its own `index.html` + `main.jsx`

Each app currently references `/app/frontend/src/App.jsx` as the router
entrypoint. Split it: b2c-engine gets guest routes only, b2b-pms gets
`/t/:slug/admin/*`, super-admin gets `/super-admin/*`.

Provided as `apps/*/src/index.html` + `main.jsx` stubs by Phase 4 vite
configs. You'll need to hand-carve the router split.

### 3. Nginx / k8s ingress path routing

```nginx
# /etc/nginx/conf.d/aura.conf

upstream b2c { server 127.0.0.1:5173; }
upstream b2b { server 127.0.0.1:5174; }
upstream ops { server 127.0.0.1:5175; }

server {
  listen 80;

  # Backend stays on 8001
  location /api/ { proxy_pass http://127.0.0.1:8001; }

  # Super admin control plane
  location /super-admin/ { proxy_pass http://ops; }

  # Per-tenant PMS admin
  location ~ ^/t/[^/]+/admin/ { proxy_pass http://b2b; }

  # Legacy admin redirects (backward-compat)
  location /admin/ { proxy_pass http://b2b; }

  # Everything else — the guest storefront (Home, /t/:slug/*, /rooms, etc.)
  location / { proxy_pass http://b2c; }
}
```

### 4. Production builds — CI/CD

Each app builds independently:

```bash
yarn workspace @aura/b2c-engine build   # → apps/b2c-engine/dist
yarn workspace @aura/b2b-pms build      # → apps/b2b-pms/dist
yarn workspace @aura/super-admin build  # → apps/super-admin/dist
```

Deploy each `dist/` to a separate Vercel project / S3+CloudFront / Docker image.

### 5. Rollback story

Because each app deploys independently:
- A broken b2b-pms release doesn't touch b2c-engine or super-admin.
- Roll back only the affected app.
- Bundle size drops for guests — they no longer ship admin JS.

---

## Why we didn't activate this in Sprint 14

The file moves + import rewrites are safe (verified by testing agent). But
activating three independent processes requires:

1. Splitting `App.jsx` into three per-app routers (~2 h careful work).
2. Updating supervisor configs (needs sysadmin approval in prod).
3. Updating nginx / k8s ingress (needs infra approval in prod).
4. Full end-to-end retest with the new routing topology.

Those four steps are best done as a **dedicated release** rather than
bundled into a code-only sprint. The monorepo shape shipped in Sprint 14
lets you do the switch on your own schedule, without another code sprint.
