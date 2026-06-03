# SEO Configuration Checklist

## ✅ Required Configuration (Must Do)

### 1. **Set Site URL Environment Variable**

Add this to your `.env.local` file (for development) and your production environment:

```env
NEXT_PUBLIC_SITE_URL=https://www.bekurtechnologies.com
```

**Where to add:**
- **Development**: Create or update `.env.local` in the project root
- **Production**: Add to your hosting platform's environment variables (Vercel, Netlify, etc.)

**Why:** This ensures all absolute URLs in meta tags are correct for social sharing and SEO.

---

## 🔧 Optional but Recommended Configuration

### 2. **Add Social Media Links**

**File:** `src/components/StructuredData.tsx` (lines 19-24)

Uncomment and update with your actual social media URLs:

```typescript
sameAs: [
  "https://www.facebook.com/bekurtechnologies",  // Replace with your actual Facebook page
  "https://www.twitter.com/bekurtech",           // Replace with your actual Twitter/X profile
  "https://www.linkedin.com/company/bekur-technologies", // Replace with your actual LinkedIn page
  // Add more if you have: Instagram, YouTube, etc.
],
```

**Why:** Helps search engines understand your brand's social presence.

---

### 3. **Update Twitter Handle (if different)**

**File:** `src/app/layout.tsx` (line 88)

If your Twitter/X handle is NOT `@bekurtech`, update it:

```typescript
twitter: {
  // ... other settings
  creator: "@your-actual-handle",  // Change this
},
```

**Why:** Properly attributes Twitter Card shares to your account.

---

### 4. **Add Google Search Console Verification**

**File:** `src/app/layout.tsx` (lines 93-96)

After verifying your site in Google Search Console, uncomment and add your verification code:

```typescript
verification: {
  google: "your-verification-code-here",  // Get this from Google Search Console
},
```

**Steps:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (www.bekurtechnologies.com)
3. Choose "HTML tag" verification method
4. Copy the content value from the meta tag
5. Paste it in the code above

**Why:** Verifies site ownership and enables search performance tracking.

---

### 5. **Create Open Graph Image (Optional but Recommended)**

**Current:** Using SVG logo (works but not optimal)

**Better:** Create a 1200x630px PNG/JPG image

**Steps:**
1. Create an image 1200x630px with your logo and tagline
2. Save it as `/public/og-image.png` or `/public/og-image.jpg`
3. Update `src/app/layout.tsx` line 70:

```typescript
images: [
  {
    url: `${siteUrl}/og-image.png`,  // Change from logo-light.svg to og-image.png
    width: 1200,
    height: 630,
    alt: "Bekur Technologies - Cutting-Edge Digital Solutions",
  },
],
```

**Why:** Better visual preview when sharing on social media.

---

## 📋 Quick Configuration Summary

### Minimum Required:
- [ ] Add `NEXT_PUBLIC_SITE_URL` to environment variables

### Recommended:
- [ ] Add social media links in `StructuredData.tsx`
- [ ] Verify Twitter handle in `layout.tsx`
- [ ] Add Google Search Console verification
- [ ] Create and use OG image (1200x630px)

---

## 🚀 After Configuration

1. **Deploy your changes**
2. **Submit sitemap to Google Search Console:**
   - Go to Google Search Console
   - Navigate to Sitemaps
   - Submit: `https://www.bekurtechnologies.com/sitemap.xml`

3. **Test social sharing:**
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

4. **Wait for Google to re-crawl:**
   - Favicon will appear in search results after Google re-crawls (can take days/weeks)
   - Use Google Search Console to request indexing

---

## 📝 Files to Edit

1. **`.env.local`** (or production env vars) - Add `NEXT_PUBLIC_SITE_URL`
2. **`src/components/StructuredData.tsx`** - Add social media links
3. **`src/app/layout.tsx`** - Update Twitter handle & Google verification (optional)
4. **`/public/og-image.png`** - Create OG image file (optional)
