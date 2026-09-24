import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cardLinkClass } from "@/components/ui/Card";
import { audiences } from "@/lib/config/site";
import { blurFor } from "@/lib/images/placeholder";
import type { Guide } from "@/lib/schema/article";

/** Guide teaser with its cover photo. Photos are decorative here (the title says what the card is), so alt is empty. */
/** Set `eager` on the first card when it's likely the largest thing on screen (e.g. top of /guides). */
export function GuideCard({ guide, headingLevel = "h3", eager = false }: { guide: Guide; headingLevel?: "h2" | "h3"; eager?: boolean }) {
  const Heading = headingLevel;
  return (
    <Link href={`/guides/${guide.slug}`} className={`${cardLinkClass} overflow-hidden`}>
      <div className="relative aspect-video overflow-hidden bg-surface">
        <Image
          src={guide.image.src}
          alt=""
          fill
          placeholder={blurFor(guide.image.src) ? "blur" : "empty"} blurDataURL={blurFor(guide.image.src)}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="flex flex-wrap gap-1.5">
          {guide.audience.map((a) => (
            <Badge key={a} tone="brand">{audiences.find((x) => x.slug === a)?.short}</Badge>
          ))}
        </span>
        <Heading className="mt-3 font-sans text-lg font-bold leading-snug tracking-tight group-hover:text-brand-700">{guide.title}</Heading>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{guide.description}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium text-muted">
          <Clock aria-hidden className="size-3.5" /> {guide.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}
