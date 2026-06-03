#!/bin/bash

# Quick script to list and access backups

BACKUP_DIR="/root/bekur-website-backups"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Bekur Website Backups ===${NC}"
echo ""

if [ ! -d "${BACKUP_DIR}" ]; then
    echo "Backup directory does not exist: ${BACKUP_DIR}"
    exit 1
fi

# Count backups
BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "bekur-website-backup-*.tar.gz" -type f | wc -l)

if [ "$BACKUP_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}No backups found in ${BACKUP_DIR}${NC}"
    exit 0
fi

echo -e "${GREEN}Total backups: ${BACKUP_COUNT}${NC}"
echo ""
echo -e "${BLUE}Available backups:${NC}"
echo ""

# List backups with details
ls -lht "${BACKUP_DIR}"/bekur-website-backup-*.tar.gz 2>/dev/null | while read -r line; do
    if [ -n "$line" ]; then
        # Extract filename
        FILENAME=$(echo "$line" | awk '{print $NF}')
        BASENAME=$(basename "$FILENAME")
        
        # Extract date from filename (format: bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz)
        if [[ $BASENAME =~ bekur-website-backup-([0-9]{8})_([0-9]{6})\.tar\.gz ]]; then
            DATE_STR="${BASH_REMATCH[1]}"
            TIME_STR="${BASH_REMATCH[2]}"
            # Format date: YYYYMMDD -> YYYY-MM-DD
            FORMATTED_DATE="${DATE_STR:0:4}-${DATE_STR:4:2}-${DATE_STR:6:2}"
            # Format time: HHMMSS -> HH:MM:SS
            FORMATTED_TIME="${TIME_STR:0:2}:${TIME_STR:2:2}:${TIME_STR:4:2}"
            
            # Get file size
            SIZE=$(echo "$line" | awk '{print $5}')
            
            echo -e "${GREEN}📦 ${BASENAME}${NC}"
            echo "   Date: ${FORMATTED_DATE} ${FORMATTED_TIME}"
            echo "   Size: ${SIZE}"
            echo "   Path: ${FILENAME}"
            echo ""
        else
            echo "$line"
        fi
    fi
done

# Calculate total size
TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
echo -e "${BLUE}Total backup storage: ${TOTAL_SIZE}${NC}"
echo ""
echo -e "${YELLOW}To extract a backup:${NC}"
echo "  tar -xzf ${BACKUP_DIR}/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz"
echo ""
echo -e "${YELLOW}To view backup contents:${NC}"
echo "  tar -tzf ${BACKUP_DIR}/bekur-website-backup-YYYYMMDD_HHMMSS.tar.gz"
echo ""
echo -e "${YELLOW}For more information, see:${NC}"
echo "  /root/bekur-website/scripts/BACKUP_README.md"

