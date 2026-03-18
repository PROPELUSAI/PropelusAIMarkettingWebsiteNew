---
name: Production Server Details
description: Hetzner server SSH access, directory structure, services, and deployment setup for propelusai.com
type: reference
---

## Server Access

- **IP:** 5.223.82.187
- **IPv6:** 2a01:4ff:2f0:14d7::1
- **OS:** Ubuntu 24.04 LTS
- **User:** root (password auth disabled, key-only)
- **SSH Key (local):** `~/.ssh/propelusai_deploy`
- **SSH Command:** `ssh -i ~/.ssh/propelusai_deploy -o StrictHostKeyChecking=no root@5.223.82.187`
- **Provider:** Hetzner Cloud (2GB RAM, Singapore region)

## Domain

- **Primary:** https://www.propelusai.com
- **Also:** https://propelusai.com (redirects to www)
- **SSL:** Let's Encrypt via Certbot, auto-renewing

## Directory Structure

```
/var/www/propelusai-website/       # Next.js app root (cloned from main branch)
├── .env.production                # Production environment variables (the ONLY env file, .env was removed)
├── .next/                         # Build output
├── node_modules/
├── src/
├── public/
├── .env.backup                    # Old .env moved here (DO NOT restore, has wrong MongoDB creds)
└── package.json

/backups/                          # Daily backups (2 AM cron, 7-day retention)
/usr/local/bin/backup-propelusai.sh  # Backup script
/var/log/backup-propelusai.log       # Backup log
```

## Services & Processes

| Service | Details |
|---|---|
| **PM2** | App name: `propelusai-website`, runs `npm start` on port 3000 |
| **Nginx** | Reverse proxy, config at `/etc/nginx/sites-available/propelusai.com` |
| **Certbot** | SSL auto-renewal via systemd timer |
| **Fail2ban** | SSH brute force protection (5 retries, 1hr ban) |
| **UFW** | Firewall: ports 22, 80, 443 only |

## Common Server Commands

```bash
# SSH into server
ssh -i ~/.ssh/propelusai_deploy -o StrictHostKeyChecking=no root@5.223.82.187

# Run remote command pattern
ssh -i ~/.ssh/propelusai_deploy -o StrictHostKeyChecking=no root@5.223.82.187 "COMMAND_HERE"

# App management
pm2 status
pm2 logs propelusai-website --lines 50 --nostream
pm2 restart propelusai-website
pm2 flush propelusai-website    # Clear logs

# Deploy manually
cd /var/www/propelusai-website && git pull origin main && npm install && npm run build && pm2 restart propelusai-website

# Nginx
nginx -t                        # Test config
systemctl reload nginx
cat /etc/nginx/sites-available/propelusai.com

# SSL
certbot renew --dry-run
```

## CI/CD

- **GitHub Actions** workflow at `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Uses `appleboy/ssh-action` to SSH in, pull, build, restart
- **GitHub Secrets needed:** `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`
- CI/CD SSH key on server: `/root/.ssh/github_actions_deploy`

## Key Notes

- **Node.js:** v20.20.1 LTS (installed via NodeSource, not nvm)
- **npm:** v10.8.2
- **PM2:** v6.0.14 with pm2-logrotate (10MB max, 7-day retention, compressed)
- **MongoDB Atlas** must whitelist both IPv4 `5.223.82.187` AND IPv6 `2a01:4ff:2f0:14d7::1`
- **Unattended upgrades** enabled (auto security patches, no auto reboot)
- **PM2 startup** configured — app auto-restarts on server reboot
