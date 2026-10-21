/**
 * 143 Input Enhancement Deep — تمييز بصري عميق: ألوان + bold + underline.
 */
export function highlight(text: string, keyword: string): string { return text.replace(keyword, `<mark>${keyword}</mark>`); }
