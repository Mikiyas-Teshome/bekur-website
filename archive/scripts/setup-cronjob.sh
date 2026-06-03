#!/bin/bash

# Setup cronjob for Bekur Website backups
# This script creates a system cronjob that runs daily backups

set -e

CRON_FILE="/etc/cron.d/bekur-website-backup"
BACKUP_SCRIPT="/root/bekur-website/scripts/backup.sh"
CLEANUP_SCRIPT="/root/bekur-website/scripts/cleanup-old-backups.sh"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up cronjob for Bekur Website backups...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    exit 1
fi

# Verify backup script exists
if [ ! -f "${BACKUP_SCRIPT}" ]; then
    echo -e "${RED}Error: Backup script not found at ${BACKUP_SCRIPT}${NC}"
    exit 1
fi

# Make sure scripts are executable
chmod +x "${BACKUP_SCRIPT}"
chmod +x "${CLEANUP_SCRIPT}"

# Create cronjob file
cat > "${CRON_FILE}" << EOF
# Bekur Website Daily Backup Cronjob
# Runs every day at 2:00 AM
# Cleanup runs every 10 days at 2:30 AM

# Daily backup at 2:00 AM
0 2 * * * root ${BACKUP_SCRIPT} >> /var/log/bekur-website-backup.log 2>&1

# Cleanup old backups every 10 days at 2:30 AM (on 1st, 11th, 21st of month)
30 2 1,11,21 * * root ${CLEANUP_SCRIPT} >> /var/log/bekur-website-backup-cleanup.log 2>&1
EOF

# Set proper permissions
chmod 644 "${CRON_FILE}"

echo -e "${GREEN}✓ Cronjob created successfully!${NC}"
echo ""
echo "Cronjob file: ${CRON_FILE}"
echo "Backup schedule: Daily at 2:00 AM"
echo "Cleanup schedule: Every 10 days at 2:30 AM (1st, 11th, 21st of month)"
echo ""
echo "To verify the cronjob:"
echo "  sudo cat ${CRON_FILE}"
echo ""
echo "To view backup logs:"
echo "  sudo tail -f /var/log/bekur-website-backup.log"
echo ""
echo "To test the backup manually:"
echo "  sudo ${BACKUP_SCRIPT}"

