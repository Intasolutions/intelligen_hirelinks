import Image from 'next/image';

/**
 * growmedlink-logo.png is a single stacked lockup (icon over wordmark) — the
 * Figma export crops the icon and wordmark from it separately via oversized,
 * offset absolute images rather than two source files. Reused wherever the
 * horizontal GrowMedLink lockup (icon + text side by side) is needed.
 */
export function GrowMedLinkLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="relative h-6 w-6 shrink-0 overflow-hidden">
        <Image
          src="/images/home/growmedlink-logo.png"
          alt=""
          width={100}
          height={100}
          className="absolute left-[-42%] top-0 h-[195%] w-[184%] max-w-none object-contain"
        />
      </div>
      <div className="relative h-5 w-[136px] overflow-hidden">
        <Image
          src="/images/home/growmedlink-logo.png"
          alt="GrowMedLink"
          width={400}
          height={400}
          className="absolute left-0 top-[-374%] h-[729%] w-full max-w-none object-contain"
        />
      </div>
    </div>
  );
}
