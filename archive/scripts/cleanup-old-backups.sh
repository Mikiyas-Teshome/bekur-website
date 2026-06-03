#!/bin/bash

# Cleanup script for old backups
# Removes backups older than 10 days

BACKUP_DIR="/root/bekur-website-backups"
RETENTION_DAYS=10

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Cleaning up backups older than ${RETENTION_DAYS} days...${NC}"

if [ ! -d "${BACKUP_DIR}" ]; then
    echo "Backup directory does not exist: ${BACKUP_DIR}"
    exit 0
fi

# Count backups before cleanup
BEFORE_COUNT=$(find "${BACKUP_DIR}" -name "bekur-website-backup-*.tar.gz" -type f | wc -l)

# Remove backups older than retention period
DELETED=$(find "${BACKUP_DIR}" -name "bekur-website-backup-*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete -print | wc -l)

# Count backups after cleanup
AFTER_COUNT=$(find "${BACKUP_DIR}" -name "bekur-website-backup-*.tar.gz" -type f | wc -l)

echo -e "${GREEN}Cleanup completed!${NC}"
echo "Backups before: ${BEFORE_COUNT}"
echo "Backups deleted: ${DELETED}"
echo "Backups remaining: ${AFTER_COUNT}"

