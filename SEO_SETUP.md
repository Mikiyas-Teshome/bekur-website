# SEO Setup Documentation

This document outlines the SEO optimizations implemented for Bekur Technologies website.

## ✅ Implemented Features

### 1. **Meta Tags & Metadata**
- Comprehensive title and description tags
- Keywords meta tag
- Author, creator, and publisher information
- Canonical URLs
- Robots meta tags with Google Bot configuration

### 2. **Favicon Configuration**
- Multiple favicon formats (ICO, SVG for light/dark themes)
- Apple touch icon
- Properly configured in Next.js metadata API
- Web manifest file for PWA support

### 3. **Open Graph Tags (Social Media Sharing)**
- Complete Open Graph metadata for Facebook, LinkedIn, etc.
- Title, description, images, and site name
- Proper image dimensions (1200x630 recommended)
- Currently using SVG logo (can be upgraded to PNG/JPG)

### 4. **Twitter Card Tags**
- Summary large image card
- Title, description, and images
- Twitter handle (@bekurtech)

### 5. **Structured Data (JSON-LD)**
- Organization schema for better search engine understanding
- Website schema with search functionality
- Helps with rich snippets in search results

### 6. **Sitemap**
- Dynamic sitemap generation at `/sitemap.xml`
- Includes all main pages
- Proper priority and change frequency settings

### 7. **Robots.txt**
- Configured to allow all search engines
- Points to sitemap
- Blocks admin and API routes

## 🔧 Configuration

### Environment Variables

Add to your `.env.local` or production environment:

```env
NEXT_PUBLIC_SITE_URL=https://www.bekurtechnologies.com
```

This ensures all absolute URLs in meta tags are correct.

## 📝 Next Steps for Better SEO

### 1. **Create Open Graph Image**
For best social media sharing results, create a 1200x630px image:
- Place it at `/public/og-image.png` or `/public/og-image.jpg`
- Update `src/app/layout.tsx` line 70 to use: `${siteUrl}/og-image.png`

### 2. **Google Search Console**
1. Verify your website in Google Search Console
2. Add the verification code to `src/app/layout.tsx` line 95:
   ```typescript
   verification: {
     google: "your-verification-code-here",
   },
   ```
3. Submit your sitemap: `https://www.bekurtechnologies.com/sitemap.xml`

### 3. **Update Social Media Links**
In `src/components/StructuredData.tsx`, add your actual social media profiles:
```typescript
sameAs: [
  "https://www.facebook.com/bekurtechnologies",
  "https://www.twitter.com/bekurtech",
  "https://www.linkedin.com/company/bekur-technologies",
],
```

### 4. **Update Twitter Handle**
If your Twitter handle is different, update it in `src/app/layout.tsx` line 88.

### 5. **Test Your SEO**
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 6. **Additional SEO Best Practices**
- Ensure all images have proper `alt` attributes
- Use semantic HTML
- Optimize page load speed
- Ensure mobile responsiveness
- Add breadcrumbs schema if needed
- Consider adding FAQ schema for FAQ pages
- Add article schema for blog posts

## 📊 Monitoring

After deployment:
1. Monitor Google Search Console for indexing status
2. Check social media sharing previews
3. Monitor search rankings for target keywords
4. Track organic traffic in Google Analytics

## 🔍 Files Modified/Created

- `src/app/layout.tsx` - Main SEO metadata
- `src/components/StructuredData.tsx` - JSON-LD structured data
- `public/robots.txt` - Search engine crawler instructions
- `src/app/sitemap.ts` - Dynamic sitemap generation
- `public/site.webmanifest` - PWA manifest

## ⚠️ Important Notes

- The favicon will be picked up by Google after the site is re-crawled (can take days to weeks)
- Social media platforms cache Open Graph data - use their debugger tools to refresh
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in production
- Test all meta tags after deployment

