export function touch48(size: number, axis: 'both' | 'vertical' = 'both') {
  const pad = Math.max(0, Math.ceil((48 - size) / 2));
  const side = axis === 'both' ? pad : 0;
  return { top: pad, bottom: pad, left: side, right: side };
}
