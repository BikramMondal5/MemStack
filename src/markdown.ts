import { marked } from "marked";
import TerminalRenderer from "marked-terminal";

marked.setOptions({
  renderer: new TerminalRenderer() as any,
});

export function renderMarkdown(markdown: string) {
  return marked(markdown);
}
