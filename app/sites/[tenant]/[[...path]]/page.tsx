import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedSite } from "@/lib/sites";
import { EVENT_TYPE_META } from "@/lib/sites/catalog";
import { resolveSiteTheme } from "@/lib/sites/design";
import SiteRenderer from "@/src/components/sites/site-renderer";

export const dynamic = "force-dynamic"; // le contenu dépend du site demandé

type Props = { params: Promise<{ tenant: string; path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params;
  const site = await getPublishedSite(decodeURIComponent(tenant));
  if (!site) return {};

  const title = site.seo.title ?? site.name;
  const description = site.seo.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: site.seo.image ? [site.seo.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: site.seo.image ? [site.seo.image] : undefined,
    },
  };
}

export default async function SitePage({ params }: Props) {
  const { tenant, path } = await params;
  const site = await getPublishedSite(decodeURIComponent(tenant));
  if (!site) notFound();

  const pathname = "/" + (path ?? []).join("/");
  const page = site.snapshot.pages.find((candidate) => candidate.path === pathname);
  if (!page) notFound();

  const theme = resolveSiteTheme(site);
  const sections = page.sections.filter((section) => section.isVisible !== false);
  const eventTypeLabel = theme.eventType
    ? EVENT_TYPE_META[theme.eventType].label
    : site.template.name;
  const appUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.text }}>
      <SiteRenderer
        sections={sections}
        theme={theme}
        context={{
          name: site.name,
          eventType: theme.eventType,
          eventTypeLabel,
          organizer: site.organizer,
          appUrl,
        }}
      />
    </main>
  );
}
