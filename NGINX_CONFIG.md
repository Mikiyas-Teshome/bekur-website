# Nginx Configuration for File Uploads

## Problem

If you're experiencing `413 Request Entity Too Large` errors when uploading files, nginx is blocking the request before it reaches the Next.js application. This happens because nginx has a default `client_max_body_size` limit (usually 1MB).

## Solution

You need to increase the `client_max_body_size` directive in your nginx configuration.

### Option 1: Global Configuration (Recommended)

Edit your main nginx configuration file (usually `/etc/nginx/nginx.conf`):

```nginx
http {
    # Increase the maximum allowed size of the client request body
    client_max_body_size 10M;  # or 20M, 50M, 100M, etc.
    
    # Also increase timeouts for large file uploads
    client_body_timeout 300s;
    client_header_timeout 300s;
    
    # ... rest of your configuration
}
```

### Option 2: Site-Specific Configuration

If you only want to increase the limit for this specific site, edit your site configuration file (usually in `/etc/nginx/sites-available/`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Increase the maximum allowed size of the client request body
    client_max_body_size 10M;  # or 20M, 50M, etc.
    
    # Increase timeouts for large file uploads
    client_body_timeout 300s;
    client_header_timeout 300s;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Increase proxy timeouts for large uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

### Option 3: Location-Specific Configuration

If you only want to allow larger uploads for the media upload endpoint:

```nginx
server {
    # ... other configuration
    
    location /api/admin/media/upload {
        client_max_body_size 10M;
        client_body_timeout 300s;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # ... other locations
}
```

## After Making Changes

1. Test your nginx configuration:
   ```bash
   sudo nginx -t
   ```

2. If the test passes, reload nginx:
   ```bash
   sudo systemctl reload nginx
   # or
   sudo service nginx reload
   ```

## Recommended Values

- **For images only**: `10M` (10 megabytes) should be sufficient
- **For images and videos**: `50M` or `100M` depending on your needs
- **For very large files**: `500M` or `1G` (use with caution)

## Notes

- The application currently compresses images to under 1MB on the client side, but having a higher nginx limit provides a safety margin
- Make sure your Next.js application and MinIO storage can handle the file sizes you configure
- Consider your server's available memory and disk space when setting these limits
- The timeout values (300s = 5 minutes) should be sufficient for most uploads, but you may need to increase them for very large files or slow connections

## Troubleshooting

If you still get 413 errors after updating nginx:

1. Verify the configuration was reloaded:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

2. Check which nginx configuration file is actually being used:
   ```bash
   sudo nginx -T | grep client_max_body_size
   ```

3. Make sure you're editing the correct configuration file (check `/etc/nginx/nginx.conf` and `/etc/nginx/sites-enabled/`)

4. Check nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

5. If using Docker, you may need to update the nginx configuration in your Docker setup or docker-compose file

