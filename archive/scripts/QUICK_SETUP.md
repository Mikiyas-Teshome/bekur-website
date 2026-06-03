# Quick Setup Guide - Backup System

## Installation

Run the setup script as root:

```bash
sudo bash /root/bekur-website/scripts/setup-cronjob.sh
```

This will:
- Create a daily cronjob that runs backups at 2:00 AM
- Set up automatic cleanup of backups older than 10 days
- Configure log files for monitoring

## Manual Backup

To create a backup immediately:

```bash
sudo bash /root/bekur-website/scripts/backup.sh
```

## View Backups

To list all available backups:

```bash
bash /root/bekur-website/scripts/list-backups.sh
```

## Backup Location

All backups are stored in:
```
/root/bekur-website-backups/
```

## What Gets Backed Up

- PostgreSQL database (full dump)
- Environment configuration (.env file)
- Backup metadata

## Backup Schedule

- **Daily backups**: 2:00 AM every day
- **Cleanup**: Automatically removes backups older than 10 days
- **Manual cleanup**: Runs on 1st, 11th, and 21st of each month at 2:30 AM

## Accessing Backups

### List Backups
```bash
bash /root/bekur-website/scripts/list-backups.sh
```

### Extract a Backup
```bash
tar -xzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz
```

### View Backup Contents
```bash
tar -tzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz
```

## Restore Database

1. Extract the backup:
```bash
cd /tmp
tar -xzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz
cd bekur-website-backup-YYYYMMDD_HHMMSS
```

2. Restore database:
```bash
# Using custom format (recommended)
pg_restore -d $DATABASE_URL -c database.sql.dump

# Or using plain SQL
psql $DATABASE_URL < database.sql
```

## Monitoring

### View Backup Logs
```bash
sudo tail -f /var/log/bekur-website-backup.log
```

### Check Cronjob Status
```bash
sudo cat /etc/cron.d/bekur-website-backup
```

## Troubleshooting

### Test Backup Script
```bash
sudo bash /root/bekur-website/scripts/backup.sh
```

### Check Disk Space
```bash
df -h /root
```

### Verify Database Connection
```bash
psql $DATABASE_URL -c "SELECT version();"
```

For detailed information, see: `BACKUP_README.md`

