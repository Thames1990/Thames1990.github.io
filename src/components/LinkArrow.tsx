import { ArrowUpRight } from 'lucide-react';

export function LinkArrow() {
  return (
    <ArrowUpRight
      data-link-arrow
      className="inline-block size-[1em] shrink-0 align-[-0.125em]"
      aria-hidden="true"
      focusable="false"
    />
  );
}
