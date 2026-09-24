export function Sources({ sources }: { sources: { label: string; url: string }[] }) {
  return (
    <section aria-labelledby="sources-title">
      <h2 id="sources-title" className="text-xl">Sources</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} rel="noopener" target="_blank">{s.label}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
