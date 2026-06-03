export function normalizeTiptapContent(
  content: Record<string, unknown> | string | null | undefined
): Record<string, unknown> | undefined {
  if (!content) {
    return undefined;
  }

  if (typeof content === "string") {
    return createDocFromText(content);
  }

  if (content.type === "doc" && Array.isArray(content.content)) {
    return content;
  }

  if (typeof content.content === "string") {
    return createDocFromText(content.content);
  }

  if (typeof content.text === "string") {
    return createDocFromText(content.text);
  }

  return undefined;
}

function createDocFromText(text: string): Record<string, unknown> {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: text ? [{ type: "text", text }] : [],
      },
    ],
  };
}
