import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Callout } from "@/components/ui/Callout";

// Components available inside guide MDX files. Internal links use next/link.
export const mdxComponents: MDXComponents = {
  a: ({ href = "", children, ...rest }) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} rel="noopener" target="_blank" {...rest}>
        {children}
      </a>
    ),
  table: (props) => (
    <div className="not-prose my-6 overflow-x-auto rounded-card border border-line">
      <table className="w-full text-sm [&_td]:border-t [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_th]:bg-surface [&_th]:px-3 [&_th]:py-2 [&_th]:text-left" {...props} />
    </div>
  ),
  Callout,
};
