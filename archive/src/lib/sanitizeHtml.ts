import { load } from "cheerio";

export function sanitizeHtml(inputHtml: string): string {
  if (!inputHtml) return "";
  const $ = load(inputHtml);

  // Remove unsafe elements (keep iframe/audio/video and sanitize below)
  $("script, style, object, embed, link").remove();

  // Remove on* inline event handlers
  $("*").each((_, el) => {
    const attribs = (el as unknown as { attribs?: Record<string, string> }).attribs || {};
    Object.keys(attribs).forEach((attr) => {
      if (/^on[a-z]+/i.test(attr)) {
        $(el).removeAttr(attr);
      }
    });
  });

  // Force target _blank links to be safe
  $("a[target='_blank']").attr("rel", "noopener noreferrer");

  // Allow only safe iframe sources
  const allowedIframeHosts = new Set([
    "www.youtube.com",
    "youtube.com",
    "youtu.be",
    "player.vimeo.com",
    "vimeo.com",
    "w.soundcloud.com",
    "soundcloud.com",
    "open.spotify.com",
    "spotify.com",
    "www.google.com",
    "maps.google.com",
  ]);

  $("iframe").each((_, el) => {
    const $el = $(el);
    const src = $el.attr("src") || "";
    try {
      const url = new URL(src, "https://dummy.origin");
      if (!allowedIframeHosts.has(url.hostname)) {
        $el.remove();
        return;
      }
      // Sanitize iframe attributes
      $el.attr("loading", "lazy");
      $el.attr("referrerpolicy", "no-referrer-when-downgrade");
      $el.attr("frameborder", "0");
      $el.attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      $el.attr("allowfullscreen", "true");
      // Ensure no inline JS handlers remain
      const attribs = (el as unknown as { attribs?: Record<string, string> }).attribs || {};
      Object.keys(attribs).forEach((attr) => {
        if (/^on[a-z]+/i.test(attr)) {
          $el.removeAttr(attr);
        }
      });
    } catch {
      // If invalid URL, remove
      $el.remove();
    }
  });

  // Ensure audio/video tags are safe and controllable
  $("video, audio").each((_, el) => {
    const $el = $(el);
    $el.attr("controls", "true");
    $el.attr("preload", "metadata");
    // Remove autoplay/muted if undesired; keep muted for inline playback if author sets
    // $el.removeAttr("autoplay");
  });

  // Return only inner HTML (avoid injecting full html/head/body wrappers)
  const body = $("body");
  if (body.length) {
    return body.html() || "";
  }
  return $.root().html() || "";
}


