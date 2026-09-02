import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SettingsService } from '../../../services/settings.service';

interface ContactSettings {
  companyEmail?: string;
  companyPhone?: string;
  city?: string;
  countryCode?: string;
  addresses?: { address: string; isPrimary: boolean }[];
}

async function getContactSettings(): Promise<ContactSettings | null> {
  try {
    const res = await SettingsService.getSettings();
    return res.success ? (res.data as ContactSettings) : null;
  } catch {
    return null;
  }
}

const LOREM = 'Have questions about our programmes or placement services? Contact Intelligen Hirelinks today. Our team is ready to guide you toward the right nursing career opportunities.';

const AVAILABLE_FLAG_CODES = new Set(['au', 'br', 'in', 'us']);

function IconPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2a9d8f] bg-white text-[#2a9d8f] sm:h-10 sm:w-10">
      {children}
    </span>
  );
}

export async function ContactHero() {
  const settings = await getContactSettings();
  const primaryAddress = settings?.addresses?.find((a) => a.isPrimary) ?? settings?.addresses?.[0];
  const flagCode = settings?.countryCode?.toLowerCase();

  return (
    <section className="w-full bg-white px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-16 lg:pt-32">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: giant heading */}
        <div className="flex flex-col items-start">
          <h1
            className="select-none font-display-rounded font-bold uppercase leading-[0.9] text-[#9a9a9a]"
            style={{ fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-0.02em' }}
          >
            Contact Us
          </h1>
          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-black/70 sm:text-base">
            {LOREM}
          </p>
        </div>

        {/* Right: contact details + photo */}
        <div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {settings?.companyEmail && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#9a9a9a]">For General Enquiries</p>
                <a
                  href={`mailto:${settings.companyEmail}`}
                  className="mt-3 flex items-center gap-3 font-sans text-base text-black/80 transition-colors hover:text-[#2a9d8f] sm:text-lg"
                >
                  <IconPill>
                    <Mail className="h-4 w-4" />
                  </IconPill>
                  {settings.companyEmail}
                </a>
              </div>
            )}

            {settings?.companyEmail && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#9a9a9a]">For Careers Enquiries</p>
                <a
                  href={`mailto:${settings.companyEmail}`}
                  className="mt-3 flex items-center gap-3 font-sans text-base text-black/80 transition-colors hover:text-[#2a9d8f] sm:text-lg"
                >
                  <IconPill>
                    <Mail className="h-4 w-4" />
                  </IconPill>
                  {settings.companyEmail}
                </a>
              </div>
            )}

            {settings?.companyPhone && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#9a9a9a]">Mobile Number</p>
                <a
                  href={`tel:${settings.companyPhone}`}
                  className="mt-3 flex items-center gap-3 font-sans text-base text-black/80 transition-colors hover:text-[#2a9d8f] sm:text-lg"
                >
                  <IconPill>
                    <Phone className="h-4 w-4" />
                  </IconPill>
                  {settings.companyPhone}
                </a>
              </div>
            )}

            {(settings?.city || primaryAddress) && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#9a9a9a]">Address</p>
                <div className="mt-3 flex items-center gap-3">
                  <IconPill>
                    <MapPin className="h-4 w-4" />
                  </IconPill>
                  {settings?.city && (
                    <span className="flex items-center gap-1.5 font-sans text-base font-semibold text-[#2a67cc] sm:text-lg">
                      {flagCode && AVAILABLE_FLAG_CODES.has(flagCode) && (
                        <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
                          <Image src={`/images/flags/${flagCode}.svg`} alt="" fill className="object-cover" />
                        </span>
                      )}
                      {settings.city}
                    </span>
                  )}
                </div>
                {primaryAddress && (
                  <p className="mt-3 whitespace-pre-line font-sans text-sm leading-relaxed text-[#9a9a9a] sm:text-base">
                    {primaryAddress.address}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="relative mt-8 aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl bg-[#f2f2f2] sm:mt-10">
            {/* Placeholder office/skyscraper photo — swap for a real office
                photo by saving it to public/images/contact/contact-hero-photo.jpg
                and pointing src there. */}
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=750&fit=crop"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
