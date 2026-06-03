#!/bin/bash

# Bekur Website Backup Script
# This script backs up the PostgreSQL database and environment configuration

set -e  # Exit on error

# Configuration
PROJECT_DIR="/root/bekur-website"
BACKUP_DIR="/root/bekur-website-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="bekur-website-backup-${TIMESTAMP}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo -e "${GREEN}Starting backup process...${NC}"
echo "Backup will be saved to: ${BACKUP_DIR}/${BACKUP_NAME}"

# Load environment variables
if [ -f "${PROJECT_DIR}/.env" ]; then
    export $(cat "${PROJECT_DIR}/.env" | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env file not found at ${PROJECT_DIR}/.env${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL not found in .env file${NC}"
    exit 1
fi

# Create temporary directory for this backup
TEMP_BACKUP_DIR="${BACKUP_DIR}/${BACKUP_NAME}"
mkdir -p "${TEMP_BACKUP_DIR}"

# Backup PostgreSQL database
echo -e "${YELLOW}Backing up PostgreSQL database...${NC}"
DB_BACKUP_FILE="${TEMP_BACKUP_DIR}/database.sql"

# Remove query parameters from DATABASE_URL if present (e.g., ?schema=public)
CLEAN_DB_URL="${DATABASE_URL%%\?*}"

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database or postgresql://user:password@host/database
DB_BACKUP_SUCCESS=false
DB_HOST=""
DB_PORT=""
DB_NAME=""
DB_USER=""
DB_PASS=""

# Parse DATABASE_URL
# Remove protocol
DB_PART="${CLEAN_DB_URL#postgresql://}"
if [ -z "$DB_PART" ]; then
    echo -e "${RED}Error: Invalid DATABASE_URL format (missing postgresql://)${NC}"
else
    # Extract user:password
    CREDENTIALS="${DB_PART%%@*}"
    if [ "$CREDENTIALS" = "$DB_PART" ]; then
        echo -e "${RED}Error: Invalid DATABASE_URL format (missing @)${NC}"
    else
        DB_USER="${CREDENTIALS%%:*}"
        DB_PASS="${CREDENTIALS#*:}"
        
        # Extract host:port/database
        HOST_DB="${DB_PART#*@}"
        
        # Check if port is specified (format: host:port/database)
        if [[ "$HOST_DB" =~ ^([^:]+):([0-9]+)/(.+) ]]; then
            DB_HOST="${BASH_REMATCH[1]}"
            DB_PORT="${BASH_REMATCH[2]}"
            DB_NAME="${BASH_REMATCH[3]}"
        # Check if no port (format: host/database)
        elif [[ "$HOST_DB" =~ ^([^/]+)/(.+) ]]; then
            DB_HOST="${BASH_REMATCH[1]}"
            DB_PORT="5432"  # Default PostgreSQL port
            DB_NAME="${BASH_REMATCH[2]}"
        else
            echo -e "${RED}Error: Could not parse DATABASE_URL format${NC}"
            echo -e "${YELLOW}DATABASE_URL: ${CLEAN_DB_URL}${NC}"
            echo -e "${YELLOW}Parsed HOST_DB: ${HOST_DB}${NC}"
        fi
    fi
fi

if [ -n "$DB_HOST" ] && [ -n "$DB_NAME" ]; then
    # URL decode password if needed (basic handling)
    DB_PASS=$(echo -n "${DB_PASS}" | sed 's/%40/@/g; s/%3A/:/g; s/%2F/\//g; s/%23/#/g; s/%25/%/g')
    
    echo -e "${YELLOW}Connecting to database: ${DB_NAME}@${DB_HOST}:${DB_PORT}${NC}"
    
    # Set PGPASSWORD environment variable for pg_dump
    export PGPASSWORD="${DB_PASS}"
    
    # Test connection first
    echo -e "${YELLOW}Testing database connection...${NC}"
    CONNECTION_TEST=$(PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT version();" 2>&1)
    CONNECTION_EXIT_CODE=$?
    
    if [ $CONNECTION_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✓ Database connection successful${NC}"
        
        # Create custom format backup
        echo -e "${YELLOW}Creating database backup (custom format)...${NC}"
        DUMP_OUTPUT=$(PGPASSWORD="${DB_PASS}" pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -F c -f "${DB_BACKUP_FILE}.dump" 2>&1)
        DUMP_EXIT_CODE=$?
        
        if [ $DUMP_EXIT_CODE -eq 0 ] && [ -f "${DB_BACKUP_FILE}.dump" ]; then
            DUMP_SIZE=$(du -h "${DB_BACKUP_FILE}.dump" | cut -f1)
            echo -e "${GREEN}✓ Database backup created: ${DB_BACKUP_FILE}.dump (${DUMP_SIZE})${NC}"
            
            # Also create a plain SQL backup for easier inspection
            echo -e "${YELLOW}Creating plain SQL backup...${NC}"
            SQL_DUMP_OUTPUT=$(PGPASSWORD="${DB_PASS}" pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -F p -f "${DB_BACKUP_FILE}" 2>&1)
            SQL_DUMP_EXIT_CODE=$?
            
            if [ $SQL_DUMP_EXIT_CODE -eq 0 ] && [ -f "${DB_BACKUP_FILE}" ]; then
                SQL_SIZE=$(du -h "${DB_BACKUP_FILE}" | cut -f1)
                echo -e "${GREEN}✓ Plain SQL backup created: ${DB_BACKUP_FILE} (${SQL_SIZE})${NC}"
                DB_BACKUP_SUCCESS=true
            else
                echo -e "${YELLOW}Warning: Custom format backup created, but plain SQL backup failed${NC}"
                if [ -n "$SQL_DUMP_OUTPUT" ]; then
                    echo -e "${YELLOW}SQL dump error: ${SQL_DUMP_OUTPUT}${NC}"
                fi
                DB_BACKUP_SUCCESS=true  # Still consider it a success if custom format worked
            fi
        else
            echo -e "${RED}Error: Failed to create database backup${NC}"
            if [ -n "$DUMP_OUTPUT" ]; then
                echo -e "${YELLOW}pg_dump error output:${NC}"
                echo "$DUMP_OUTPUT"
            fi
            echo -e "${YELLOW}Trying alternative method...${NC}"
        fi
    else
        echo -e "${RED}Error: Cannot connect to database${NC}"
        echo -e "${YELLOW}Connection error output:${NC}"
        echo "$CONNECTION_TEST" | head -5
        echo -e "${YELLOW}Please verify:${NC}"
        echo "  - PostgreSQL is running"
        echo "  - Database credentials are correct"
        echo "  - Network connectivity to ${DB_HOST}:${DB_PORT}"
        echo "  - Database '${DB_NAME}' exists"
        echo "  - User '${DB_USER}' has proper permissions"
    fi
fi

# Method 2: Try using DATABASE_URL directly (if parsing method failed)
if [ "$DB_BACKUP_SUCCESS" = false ]; then
    echo -e "${YELLOW}Attempting direct DATABASE_URL connection...${NC}"
    
    # Remove query parameters for pg_dump
    if pg_dump "${CLEAN_DB_URL}" -F c -f "${DB_BACKUP_FILE}.dump" 2>&1; then
        echo -e "${GREEN}✓ Database backup created (direct method): ${DB_BACKUP_FILE}.dump${NC}"
        
        # Also create a plain SQL backup
        if pg_dump "${CLEAN_DB_URL}" -F p -f "${DB_BACKUP_FILE}" 2>&1; then
            echo -e "${GREEN}✓ Plain SQL backup created: ${DB_BACKUP_FILE}${NC}"
            DB_BACKUP_SUCCESS=true
        else
            echo -e "${YELLOW}Warning: Custom format backup created, but plain SQL backup failed${NC}"
            DB_BACKUP_SUCCESS=true
        fi
    else
        echo -e "${RED}Error: Direct DATABASE_URL method also failed${NC}"
    fi
fi

# If all methods failed, exit with error
if [ "$DB_BACKUP_SUCCESS" = false ]; then
    echo -e "${RED}Error: All backup methods failed. Please check:${NC}"
    echo "  1. PostgreSQL is running"
    echo "  2. DATABASE_URL is correct in .env file"
    echo "  3. Database user has proper permissions"
    echo "  4. Network connectivity to database server"
    echo ""
    echo "To test connection manually:"
    echo "  psql \"${CLEAN_DB_URL}\" -c \"SELECT version();\""
    rm -rf "${TEMP_BACKUP_DIR}"
    exit 1
fi

# Backup .env file (with sensitive data)
echo -e "${YELLOW}Backing up environment configuration...${NC}"
if [ -f "${PROJECT_DIR}/.env" ]; then
    cp "${PROJECT_DIR}/.env" "${TEMP_BACKUP_DIR}/.env"
    echo -e "${GREEN}✓ Environment file backed up${NC}"
else
    echo -e "${YELLOW}Warning: .env file not found${NC}"
fi

# Create backup info file
INFO_FILE="${TEMP_BACKUP_DIR}/backup-info.txt"
cat > "${INFO_FILE}" << EOF
Backup Information
==================
Date: $(date)
Project: Bekur Website
Backup Type: Full Backup
Database URL: ${DATABASE_URL%%@*}@*** (hidden for security)
EOF

# Create compressed archive
echo -e "${YELLOW}Creating compressed archive...${NC}"
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
rm -rf "${BACKUP_NAME}"
echo -e "${GREEN}✓ Compressed backup created: ${BACKUP_NAME}.tar.gz${NC}"

# Calculate backup size
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}Backup size: ${BACKUP_SIZE}${NC}"

# Clean up old backups (older than 10 days)
echo -e "${YELLOW}Cleaning up old backups (older than 10 days)...${NC}"
find "${BACKUP_DIR}" -name "bekur-website-backup-*.tar.gz" -type f -mtime +10 -delete
echo -e "${GREEN}✓ Old backups cleaned up${NC}"

echo -e "${GREEN}Backup completed successfully!${NC}"
echo "Backup location: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo ""
echo "To restore this backup, see: ${PROJECT_DIR}/scripts/BACKUP_README.md"

