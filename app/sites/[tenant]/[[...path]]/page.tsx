import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedSite, type SiteSection } from "@/lib/sites";

export const dynamic = "force-dynamic"; // le contenu dépend du site demandé

type Props = { params: Promise<{ tenant: string; path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params;
  const site = await getPublishedSite(decodeURIComponent(tenant));
  if (!site) return {};
  return {
    title: site.seo.title ?? site.name,
    description: site.seo.description,
    openGraph: site.seo.image ? { images: [site.seo.image] } : undefined,
  };
}

function Section({ section }: { section: SiteSection }) {
  const c = section.content as Record<string, string>;
  switch (section.type) {
    case "hero":
      return (
        <section style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <h1>{c.title}</h1>
          {c.subtitle && <p>{c.subtitle}</p>}
        </section>
      );
    case "text":
      return (
        <section style={{ padding: "2rem 1rem", maxWidth: 720, margin: "0 auto" }}>
          {c.heading && <h2>{c.heading}</h2>}
          <p>{c.body}</p>
        </section>
      );
    // Blocs reliés aux autres modules (billetterie, cagnotte, vote, RSVP) : à brancher
    case "tickets":
    case "fundraiser":
    case "contest":
    case "rsvp":
      return <section data-module={section.type} data-ref={c.refId} />;
    default:
      return null;
  }
}

export default async function SitePage({ params }: Props) {
  const { tenant, path } = await params;
  const site = await getPublishedSite(decodeURIComponent(tenant));
  if (!site) notFound();

  const pathname = "/" + (path ?? []).join("/");
  const page = site.snapshot.pages.find((p) => p.path === pathname);
  if (!page) notFound();

  return (
    <main style={{ ["--primary" as string]: site.theme.primaryColor ?? "#111" }}>
      {page.sections
        .filter((s) => s.isVisible !== false)
        .map((s, i) => (
          <Section key={i} section={s} />
        ))}
    </main>
  );
}
