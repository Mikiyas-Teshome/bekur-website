# Bekur Website Backup System

This document explains how to use the backup system for the Bekur Website project.

## Overview

The backup system automatically:
- Creates daily backups of the PostgreSQL database and environment configuration
- Removes backups older than 10 days
- Stores backups in `/root/bekur-website-backups/`

## Backup Contents

Each backup includes:
1. **PostgreSQL Database**: Full database dump in both custom format (`.dump`) and plain SQL (`.sql`)
2. **Environment Configuration**: Copy of the `.env` file
3. **Backup Information**: Metadata about the backup

## Backup Location

All backups are stored in:
```
/root/bekur-website-backups/
```

Backup files are named with timestamps:
```
bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz
```

## Automatic Backups

### Cronjob Setup

The backup runs automatically every day at 2:00 AM. The cronjob is configured in:
```
/etc/cron.d/bekur-website-backup
```

To view or edit the cronjob:
```bash
sudo crontab -l
# or
sudo nano /etc/cron.d/bekur-website-backup
```

### Manual Backup

To create a backup manually:
```bash
cd /root/bekur-website
bash scripts/backup.sh
```

## Accessing Backups

### List Available Backups

```bash
ls -lh /root/bekur-website-backups/
```

### View Backup Details

```bash
# List contents of a backup without extracting
tar -tzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz
```

### Extract a Backup

```bash
# Extract to current directory
tar -xzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz

# Extract to specific directory
tar -xzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz -C /tmp/backup-extract
```

## Restoring from Backup

### Restore Database

**Important**: Restoring will replace the current database. Make sure to backup the current state first!

1. Extract the backup:
```bash
cd /tmp
tar -xzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz
cd bekur-website-backup-YYYYMMDD_HHMMSS
```

2. Load environment variables:
```bash
cd /root/bekur-website
source .env
# Or manually set DATABASE_URL
```

3. Restore using custom format (recommended):
```bash
pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c database.sql.dump
```

4. Or restore using plain SQL:
```bash
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < database.sql
```

### Restore Environment File

```bash
# Extract backup
tar -xzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz -C /tmp

# Copy .env file (review it first!)
cp /tmp/bekur-website-backup-YYYYMMDD_HHMMSS/.env /root/bekur-website/.env
```

## Backup Retention

- Backups are automatically deleted after **10 days**
- The cleanup runs automatically with each backup
- You can manually run cleanup:
```bash
bash /root/bekur-website/scripts/cleanup-old-backups.sh
```

## Monitoring Backups

### Check Backup Status

```bash
# View latest backup
ls -lht /root/bekur-website-backups/ | head -5

# Check backup sizes
du -sh /root/bekur-website-backups/*

# Verify backup integrity
tar -tzf /root/bekur-website-backups/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz > /dev/null && echo "Backup is valid" || echo "Backup is corrupted"
```

### View Cronjob Logs

```bash
# Check cron logs
grep "bekur-website-backup" /var/log/syslog

# Or check mail for cron output (if configured)
mail
```

## Troubleshooting

### Backup Fails

1. Check if PostgreSQL is accessible:
```bash
psql $DATABASE_URL -c "SELECT version();"
```

2. Verify .env file exists:
```bash
ls -la /root/bekur-website/.env
```

3. Check disk space:
```bash
df -h /root
```

4. Verify backup directory permissions:
```bash
ls -ld /root/bekur-website-backups/
```

### Permission Issues

If you encounter permission issues:
```bash
# Make scripts executable
chmod +x /root/bekur-website/scripts/backup.sh
chmod +x /root/bekur-website/scripts/cleanup-old-backups.sh

# Ensure backup directory is writable
mkdir -p /root/bekur-website-backups
chmod 755 /root/bekur-website-backups
```

### Database Connection Issues

If the database connection fails:
1. Verify DATABASE_URL in .env file
2. Check if PostgreSQL is running:
```bash
sudo systemctl status postgresql
```
3. Test connection manually:
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

## Off-Site Backup (Recommended)

For additional safety, consider:
1. **Copy backups to remote server**: Use `scp` or `rsync` to copy backups to another server
2. **Cloud storage**: Upload backups to AWS S3, Google Cloud Storage, or similar
3. **Automated sync**: Set up a cronjob to sync backups to remote location

Example rsync command:
```bash
rsync -avz /root/bekur-website-backups/ user@remote-server:/backups/bekur-website/
```

## Security Notes

- Backups contain sensitive data (database passwords, API keys)
- Ensure backup directory has proper permissions (not world-readable)
- Consider encrypting backups if storing off-site
- Regularly test backup restoration to ensure backups are working

## Support

For issues or questions, check:
- Backup logs in `/var/log/syslog`
- Script output in cron mail
- Database connection status

