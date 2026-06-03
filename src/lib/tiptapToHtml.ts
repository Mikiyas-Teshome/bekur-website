import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Typography from '@tiptap/extension-typography';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { normalizeTiptapContent } from '@/lib/tiptap-content';

// Define the same extensions used in the TipTap editor (simplified version)
const extensions = [
  StarterKit.configure({
    link: false,
    strike: false,
    underline: false,
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'tiptap-image',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'tiptap-link',
    },
  }),
  Youtube.configure({
    width: 640,
    height: 480,
    HTMLAttributes: {
      class: 'tiptap-youtube',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
  Strike,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Typography,
  Color.configure({ types: [TextStyle.name] }),
  TextStyle,
  Highlight.configure({ multicolor: true }),
];

/**
 * Converts TipTap JSON content to HTML string
 * @param jsonContent - The TipTap JSON content
 * @returns HTML string
 */
export function tiptapToHtml(jsonContent: Record<string, unknown> | null): string {
  const normalized = normalizeTiptapContent(jsonContent);
  if (!normalized) {
    return '';
  }

  try {
    return generateHTML(normalized, extensions);
  } catch (error) {
    console.error('Error converting TipTap JSON to HTML:', error);
    // Fallback: return a simple paragraph with the content
    return `<p>Error rendering content. Raw content: ${JSON.stringify(jsonContent)}</p>`;
  }
}

/**
 * Safely converts TipTap content to HTML with error handling
 * @param content - The content (could be JSON or already HTML)
 * @returns HTML string
 */
export function safeTiptapToHtml(content: Record<string, unknown> | string | null): string {
  if (!content) {
    return '';
  }

  // If it's already a string, check if it's HTML or JSON
  if (typeof content === 'string') {
    // Try to parse as JSON first (in case it's a stringified TipTap content)
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
        // It's TipTap JSON content that was stringified
        return tiptapToHtml(parsed);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Not JSON, assume it's HTML
    }
    return content;
  }

  if (typeof content === 'object') {
    const normalized = normalizeTiptapContent(content);
    return normalized ? tiptapToHtml(normalized) : '';
  }

  return '';
}
