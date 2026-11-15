import type { SiteSection } from "@/lib/sites";
import {
  SITE_FAQ,
  SITE_VENUE_NOTES,
  type SiteEventType,
} from "./catalog";
import { buildSiteSections } from "./render";
import type { SiteEventSummary, SiteTemplateOption } from "./types";

export type SiteDemoContent = {
  title: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  address: string;
  city: string;
  location: string;
  details: Record<string, string>;
  program?: string;
};

/**
 * Contenu de démonstration utilisé par l'aperçu du constructeur. Il permet de
 * montrer un vrai design rempli plutôt que des blocs gris, y compris quand
 * l'événement n'a pas encore de description, de lieu ou de visuel.
 */
export const SITE_DEMO: Record<SiteEventType, SiteDemoContent> = {
  wedding: {
    title: "Awa & Marc",
    description:
      "Après huit belles années, nous avons choisi de nous dire oui entourés de ceux qui comptent le plus pour nous. Une journée simple, chaleureuse et remplie de sourires, que nous aimerions partager avec vous.",
    dateLabel: "Samedi 12 décembre 2026",
    timeLabel: "16h00",
    venueName: "Domaine de la Falaise",
    address: "Rue des Palmiers, Bonapriso",
    city: "Douala",
    location: "Domaine de la Falaise, Douala",
    details: {
      couple: "Awa Ngo & Marc Essomba",
      ceremony: "Cérémonie civile à 16h00, suivie de la bénédiction et du cocktail au Domaine de la Falaise.",
      dressCode: "Tenue de soirée — tons ivoire, beige et or.",
    },
  },
  contest: {
    title: "Talents en Scène 2026",
    description:
      "Dix candidats, trois catégories et une seule soirée pour révéler les talents de demain. Danse, chant et humour se succèdent sur la scène du Palais des Congrès.",
    dateLabel: "Vendredi 27 novembre 2026",
    timeLabel: "19h00",
    venueName: "Palais des Congrès",
    address: "Boulevard de la Liberté",
    city: "Yaoundé",
    location: "Palais des Congrès, Yaoundé",
    details: {
      registration: "Inscriptions ouvertes jusqu'au 10 novembre 2026 sur la page du concours.",
      jury: "Un jury de professionnels du spectacle et de la culture, complété par les votes du public.",
      prizes: "1er prix : 1 000 000 FCFA et une résidence artistique. 2e prix : 500 000 FCFA.",
    },
  },
  baptism: {
    title: "Baptême de Kaïla",
    description:
      "Un an de joie, un jour de grâce. Nous vous invitons à partager le baptême de notre fille Kaïla, entourés de nos familles et de nos amis les plus proches.",
    dateLabel: "Dimanche 5 avril 2026",
    timeLabel: "10h30",
    venueName: "Cathédrale Saint-Pierre",
    address: "Rue de la Cathédrale",
    city: "Douala",
    location: "Cathédrale Saint-Pierre, Douala",
    details: {
      child: "Kaïla Mbarga",
      godparents: "Sandrine Etoundi & Yann Bikoé",
      ceremony: "Messe à 10h30, suivie d'un déjeuner à la Résidence Akwa.",
    },
  },
  funeral: {
    title: "Hommage à Monsieur Jean-Baptiste Nkoulou",
    description:
      "Avec une profonde tristesse, la famille Nkoulou annonce le décès de son père, grand-père et ami. Nous vous invitons à l'accompagner dans la dignité et le recueillement.",
    dateLabel: "Jeudi 19 mars 2026",
    timeLabel: "09h00",
    venueName: "Paroisse Sainte-Anne",
    address: "Quartier Bali",
    city: "Douala",
    location: "Paroisse Sainte-Anne, Douala",
    details: {
      deceased: "Monsieur Jean-Baptiste Nkoulou (1948 – 2026)",
      service:
        "Veillée le mercredi 18 mars à partir de 20h00. Messe d'obsèques le jeudi 19 mars à 09h00, suivie de l'inhumation au cimetière de Ngodi.",
      tribute:
        "Père aimant et exemple de droiture, il laisse derrière lui une famille unie et de nombreux souvenirs.",
    },
  },
  birthday: {
    title: "Les 30 ans de Sarah",
    description:
      "Trente ans, une décennie de souvenirs et une fête à la hauteur de l'événement. Cocktails, musique et piste de danse : venez célébrer avec nous jusqu'au bout de la nuit.",
    dateLabel: "Samedi 20 juin 2026",
    timeLabel: "20h00",
    venueName: "Rooftop Le Panorama",
    address: "Boulevard de la Marina",
    city: "Douala",
    location: "Rooftop Le Panorama, Douala",
    details: {
      celebrant: "Sarah Ndongo",
      age: "30 ans",
      dressCode: "Tenue chic — noir et doré. Évitez le blanc, réservé à la reine de la soirée.",
    },
  },
  training: {
    title: "Masterclass Marketing Digital",
    description:
      "Deux jours pour maîtriser les fondamentaux de l'acquisition en ligne : stratégie de contenu, publicité Meta, mesure des performances et automatisation.",
    dateLabel: "Vendredi 24 avril 2026",
    timeLabel: "08h30",
    venueName: "Evenn Hub",
    address: "Rue Njo-Njo, Bonapriso",
    city: "Douala",
    location: "Evenn Hub, Douala",
    details: {
      trainer:
        "Clarisse Mbolo, consultante digitale depuis dix ans et formatrice pour plus de 200 entrepreneurs.",
      audience:
        "Entrepreneurs, chargés de communication et créateurs de contenu souhaitant structurer leur présence en ligne.",
      objectives:
        "Construire un tunnel d'acquisition, rédiger des contenus qui convertissent et piloter un budget publicitaire avec des indicateurs fiables.",
    },
    program:
      "08h30 — Accueil & petit-déjeuner\n09h00 — Stratégie de contenu\n11h00 — Atelier pratique\n14h00 — Publicité Meta\n16h30 — Étude de cas & questions",
  },
  festival: {
    title: "Festival Nuit Blanche 2026",
    description:
      "Deux scènes, douze artistes et une nuit entière pour célébrer la musique africaine contemporaine. Du coupé-décalé à l'afrobeat, la ville vibre au rythme des nouvelles voix.",
    dateLabel: "Samedi 8 août 2026",
    timeLabel: "18h00",
    venueName: "Esplanade du Musée National",
    address: "Avenue du 20 Mai",
    city: "Yaoundé",
    location: "Esplanade du Musée National, Yaoundé",
    details: {
      lineup: "Teni, Stanley Enow, Vagabon, DJ Micky, Les Frères Smith…",
      program:
        "18h00 — Ouverture des portes\n19h30 — Premières parties\n21h30 — Scène principale\n00h30 — DJ set de clôture",
      access:
        "Navettes gratuites depuis le centre-ville toutes les 30 minutes. Parking sécurisé sur place.",
    },
    program:
      "Ouverture des portes — Premières parties — Scène principale — DJ set de clôture",
  },
};

const PLACEHOLDER_VALUES = new Set([
  "",
  "Date à confirmer",
  "Lieu à confirmer",
  "Date à définir",
]);

function isFilled(value: string | null | undefined): value is string {
  if (!value) return false;
  return !PLACEHOLDER_VALUES.has(value.trim());
}

function pick(value: string | null | undefined, fallback: string): string {
  return isFilled(value) ? value : fallback;
}

export function demoEventSummary(event: SiteEventSummary, eventType: SiteEventType): SiteEventSummary {
  const demo = SITE_DEMO[eventType];
  return {
    ...event,
    title: pick(event.title, demo.title),
    description: pick(event.description, demo.description),
    dateLabel: isFilled(event.date) ? event.dateLabel : demo.dateLabel,
    timeLabel: pick(event.timeLabel, demo.timeLabel),
    venueName: pick(event.venueName, demo.venueName),
    address: pick(event.address, demo.address),
    city: pick(event.city, demo.city),
    location: pick(event.location, demo.location),
  };
}

const ACTION_TYPES = ["tickets", "contest", "rsvp", "guestbook", "cta"];

function insertBefore(sections: SiteSection[], types: string[], section: SiteSection): SiteSection[] {
  const index = sections.findIndex((item) => types.includes(item.type));
  const next = [...sections];
  next.splice(index === -1 ? next.length : index, 0, section);
  return next;
}

/**
 * Complète les sections d'un modèle avec le contenu manquant (galerie, accès,
 * FAQ, programme) pour que l'aperçu soit toujours dense et démonstratif.
 */
function enrichPreviewSections(
  sections: SiteSection[],
  eventType: SiteEventType,
  summary: SiteEventSummary,
  demo: SiteDemoContent,
): SiteSection[] {
  let next = [...sections];

  if (!next.some((section) => section.type === "program") && demo.program) {
    next = insertBefore(next, ["contest", "details", "venue", "gallery", ...ACTION_TYPES], {
      type: "program",
      content: { heading: "Programme", body: demo.program },
      isVisible: true,
    });
  }

  if (!next.some((section) => section.type === "venue")) {
    next = insertBefore(next, ["gallery", "faq", ...ACTION_TYPES], {
      type: "venue",
      content: {
        heading: "Accès & informations pratiques",
        body: "Tout ce qu'il faut savoir pour arriver sereinement : adresse exacte, stationnement et conseils d'accès.",
        venue: summary.venueName,
        address: summary.address,
        city: summary.city,
        note: SITE_VENUE_NOTES[eventType],
      },
      isVisible: true,
    });
  }

  if (!next.some((section) => section.type === "gallery")) {
    next = insertBefore(next, ["faq", ...ACTION_TYPES], {
      type: "gallery",
      content: { heading: "Galerie", images: [] },
      isVisible: true,
    });
  }

  if (!next.some((section) => section.type === "faq") && SITE_FAQ[eventType].length > 0) {
    next = insertBefore(next, ACTION_TYPES, {
      type: "faq",
      content: {
        heading: "Questions fréquentes",
        body: "Les réponses aux questions que vous nous posez le plus souvent.",
        items: SITE_FAQ[eventType],
      },
      isVisible: true,
    });
  }

  return next;
}

export type TemplatePreview = {
  sections: SiteSection[];
  summary: SiteEventSummary;
};

/**
 * Construit l'aperçu complet d'un modèle : contenu réel de l'événement quand il
 * existe, contenu d'exemple sinon, sections complémentaires ajoutées au besoin.
 */
export function buildTemplatePreview(
  template: SiteTemplateOption,
  event: SiteEventSummary,
  userDetails: Record<string, string> = {},
): TemplatePreview {
  const eventType = template.eventType;
  const demo = SITE_DEMO[eventType];
  const summary = demoEventSummary(event, eventType);

  const hasUserDetails = Object.values(userDetails).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  const details = hasUserDetails ? userDetails : demo.details;

  const base = buildSiteSections(template, summary, details);
  const sections = enrichPreviewSections(base, eventType, summary, demo);

  return { sections, summary };
}
