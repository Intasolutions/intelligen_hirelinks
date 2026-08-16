import Image from 'next/image';

/** growmedlink-logo.png is already a horizontal icon+wordmark lockup. */
export function GrowMedLinkLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-6 w-[136px] ${className}`}>
      <Image
        src="/images/home/growmedlink-logo.png"
        alt="GrowMedLink"
        fill
        className="object-contain object-left"
      />
    </div>
  );
}
