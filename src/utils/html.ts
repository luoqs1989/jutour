/**
 * The Visit Seoul API's `post_desc` field is rich HTML from a CMS editor
 * (inline <style> blocks, nested <div>/<span> markup). We don't want to
 * render third-party HTML directly (XSS surface), so this reduces it to
 * plain, readable text instead.
 */
export function stripHtml(html: string): string {
  const withoutStyle = html.replace(/<style[\s\S]*?<\/style>/gi, '')
  const withoutTags = withoutStyle.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div)>/gi, '\n').replace(/<[^>]+>/g, '')
  const decoded = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return decoded
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}
