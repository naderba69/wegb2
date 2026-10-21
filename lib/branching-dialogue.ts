/**
 * 116 Branching Dialogue — حوار متفرع: اختيارك يغيّر النهاية.
 */
export interface BranchNode { id: string; textDe: string; choices: { label: string; next: string }[] }
