export function touch48(size: number) {
  const pad = Math.max(0, Math.ceil((48 - size) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
}
