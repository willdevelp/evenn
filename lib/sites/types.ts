import type { SiteEventType, SitePalette, SiteSectionTemplate, SiteTemplateLayout } from "./catalog";

export type SiteTemplateOption = {
  id: string;
  key: string;
  name: string;
  eventType: SiteEventType;
  description: string;
  layout: SiteTemplateLayout;
  palette: SitePalette;
  sections: SiteSectionTemplate[];
};

export type SiteEventSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  categorySlug: string | null;
  status: string;
  coverUrl: string | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  date: string | null;
  dateLabel: string;
  timeLabel: string;
  location: string;
  publicUrl: string;
};

export type EventSiteSummary = {
  id: string;
  name: string;
  subdomain: string;
  url: string;
  status: string;
  templateName: string;
  theme: SitePalette & { variant?: string; layout?: SiteTemplateLayout };
  publishedAt: string | null;
  createdAt: string;
};

export type EventSiteContext = {
  event: SiteEventSummary;
  eventType: SiteEventType | null;
  eventTypeLabel: string | null;
  templates: SiteTemplateOption[];
  site: EventSiteSummary | null;
  domainSuffix: string;
};

export type SiteOverviewItem = EventSiteSummary & {
  eventId: string | null;
  eventTitle: string | null;
  eventType: SiteEventType | null;
};

export type SiteEligibleEvent = SiteEventSummary & {
  eventType: SiteEventType;
};

export type SiteOverview = {
  sites: SiteOverviewItem[];
  eligibleEvents: SiteEligibleEvent[];
};

export type CreatedEventSite = {
  id: string;
  subdomain: string;
  url: string;
  eventId: string;
  templateName: string;
};
