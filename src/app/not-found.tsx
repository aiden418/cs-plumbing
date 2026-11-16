import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import { Calendar, Phone } from "@/components/ui/icons";
import { NOT_FOUND } from "@/content/reading";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Find plumbing services, booking, and contact info for C&S Plumbing of Lee.",
  robots: { index: false, follow: false },
};

const quietLink =
  "inline-flex min-h-11 items-center font-semibold text-link underline-offset-4 transition-colors duration-150 hover:underline";

/** The 404 page: a type-led header with the way home, to services and the call button. */
export default function NotFound() {
  return (
    <PageHero
      layout="type-led"
      overline={NOT_FOUND.overline}
      title={NOT_FOUND.title}
      accent={NOT_FOUND.accent}
      description={NOT_FOUND.body}
      // Fill <main> (min-h-screen) so no white band sits between the header and the footer.
      className="flex min-h-screen flex-col justify-center"
      actions={
        <>
          <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
            Call {BUSINESS.phone}
          </Button>
          <Button href={NOT_FOUND.services.href} variant="secondary" size="lg">
            {NOT_FOUND.services.label}
          </Button>
          <Button
            href={NOT_FOUND.book.href}
            variant="secondary"
            size="lg"
            icon={<Calendar className="size-5" />}
          >
            {NOT_FOUND.book.label}
          </Button>
        </>
      }
    >
      <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-rule pt-4">
        <li>
          <Link href={NOT_FOUND.home.href} className={quietLink}>
            {NOT_FOUND.home.label}
          </Link>
        </li>
        <li>
          <Link href={NOT_FOUND.contact.href} className={quietLink}>
            {NOT_FOUND.contact.label}
          </Link>
        </li>
      </ul>
    </PageHero>
  );
}
