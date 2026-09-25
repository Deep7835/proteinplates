import Image from "next/image";
import Link from "next/link";
import { Apple, ArrowRight, Beef, Clock, Flame, Ruler, UtensilsCrossed, Wheat, type LucideIcon } from "lucide-react";
import { cardLinkClass } from "@/components/ui/Card";
import { audiences } from "@/lib/config/site";
import { cardTitle } from "@/lib/guides/cardTitle";
import { blurFor, placeholderStyle } from "@/lib/images/placeholder";
import type { Guide, GuideTopic } from "@/lib/schema/article";

const TOPIC_ICONS: Record<GuideTopic, LucideIcon> = {
  Protein: Beef,
  "Eating out": UtensilsCrossed,
  "Calories & weight loss": Flame,
  "Carbs & fat": Wheat,
  Nutrients: Apple,
  "Body measurements": Ruler,
};

export function TopicIcon({ topic, className = "size-3.5" }: { topic: GuideTopic; className?: string }) {
  const Icon = TOPIC_ICONS[topic];
  return <Icon aria-hidden className={className} />;
}

type Variant = "default" | "featured" | "compact";

type Props = {
  guide: Guide;
  /** default: grid card. featured: large, image beside text on wide screens. compact: small row with a thumbnail. */
  variant?: Variant;
  headingLevel?: "h2" | "h3";
  /** Load the photo right away (use for the first card near the top of a page). */
  eager?: boolean;
};

function Photo({ guide, sizes, eager, className }: { guide: Guide; sizes: string; eager: boolean; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`} style={placeholderStyle(blurFor(guide.image.src))}>
      {/* Decorative here: the card's title says what it links to. */}
      <Image
        src={guide.image.src}
        alt=""
        fill
        preload={eager}
        loading={eager ? undefined : "lazy"}
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

/** Topic label that sits on top of the photo. Solid page-colored pill, so it reads on any photo in both themes. */
function TopicChip({ topic }: { topic: GuideTopic }) {
  return (
    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-page/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-card">
      <TopicIcon topic={topic} className="size-3.5 text-brand-700" />
      {topic}
    </span>
  );
}

function ReadingTime({ minutes, className = "" }: { minutes: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Clock aria-hidden className="size-3.5" />
      {minutes} min read
    </span>
  );
}

function audienceLine(guide: Guide) {
  return guide.audience.map((a) => audiences.find((x) => x.slug === a)?.short).filter(Boolean).join(" · ");
}

export function GuideCard({ guide, variant = "default", headingLevel = "h3", eager = false }: Props) {
  const Heading = headingLevel;
  const title = cardTitle(guide.title);
  const href = `/guides/${guide.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className={`${cardLinkClass} flex-row! items-center gap-4 p-3`}>
        <Photo guide={guide} eager={eager} sizes="144px" className="aspect-[4/3] w-28 shrink-0 rounded-xl sm:w-32" />
        <span className="min-w-0 py-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
            <TopicIcon topic={guide.topic} />
            {guide.topic}
          </span>
          <Heading className="mt-1 font-sans text-base font-bold leading-snug tracking-tight group-hover:text-brand-700">{title}</Heading>
          <ReadingTime minutes={guide.readingMinutes} className="mt-1.5 text-xs text-muted" />
        </span>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className={`${cardLinkClass} p-2 lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-2`}>
        <div className="relative">
          <Photo
            guide={guide}
            eager={eager}
            sizes="(min-width: 1024px) 620px, 100vw"
            className="aspect-[16/10] rounded-[0.875rem] lg:aspect-auto lg:h-full lg:min-h-80"
          />
          <TopicChip topic={guide.topic} />
        </div>
        <div className="flex flex-col p-4 sm:p-6 lg:p-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-800">Featured guide</span>
          <Heading className="mt-3 font-display text-2xl font-semibold leading-tight group-hover:text-brand-700 sm:text-3xl">{title}</Heading>
          <p className="mt-3 line-clamp-3 text-muted">{guide.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted lg:mt-auto lg:pt-6">
            <ReadingTime minutes={guide.readingMinutes} />
            <span>For {audienceLine(guide)}</span>
          </div>
          <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-page transition-colors duration-200 group-hover:bg-brand-800">
            Read the guide
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={`${cardLinkClass} p-2`}>
      <div className="relative">
        <Photo
          guide={guide}
          eager={eager}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[16/10] rounded-[0.875rem]"
        />
        <TopicChip topic={guide.topic} />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <Heading className="font-sans text-lg font-bold leading-snug tracking-tight group-hover:text-brand-700">{title}</Heading>
        <p className="mb-4 mt-2 line-clamp-2 text-sm text-muted">{guide.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted">
          <ReadingTime minutes={guide.readingMinutes} />
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            Read
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </Link>
  );
}
