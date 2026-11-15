/**
 * Catalogue des modèles de sites événementiels.
 *
 * Le schéma Supabase ne possède que quelques valeurs dans l'enum
 * `template_kind` (event, wedding, association...). Les sept types
 * d'événements pris en charge par les sites personnalisés sont donc portés
 * par `schema.eventType`, tandis que `kind` reste compatible avec l'enum :
 *   - mariage                         -> wedding
 *   - concours, baptême, deuil, ...   -> event
 *
 * Chaque type possède exactement trois modèles dans ce catalogue.
 */

export const SITE_EVENT_TYPES = [
  "wedding",
  "contest",
  "baptism",
  "funeral",
  "birthday",
  "training",
  "festival",
] as const;

export type SiteEventType = (typeof SITE_EVENT_TYPES)[number];

export type SiteEventField = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
};

export const SITE_EVENT_FIELDS: Record<SiteEventType, SiteEventField[]> = {
  wedding: [
    { key: "couple", label: "Noms des mariés", placeholder: "Ex. Awa et Marc" },
    { key: "ceremony", label: "Détails de la cérémonie", placeholder: "Lieu et heure de la cérémonie", multiline: true },
    { key: "dressCode", label: "Code vestimentaire", placeholder: "Ex. Tenue de soirée, couleurs pastel" },
  ],
  contest: [
    { key: "registration", label: "Inscription au concours", placeholder: "Modalités et date limite", multiline: true },
    { key: "jury", label: "Jury", placeholder: "Présentation des membres du jury", multiline: true },
    { key: "prizes", label: "Récompenses", placeholder: "Prix et récompenses à gagner", multiline: true },
  ],
  baptism: [
    { key: "child", label: "Nom de l'enfant", placeholder: "Prénom de l'enfant" },
    { key: "godparents", label: "Parrain et marraine", placeholder: "Noms du parrain et de la marraine" },
    { key: "ceremony", label: "Détails de la cérémonie", placeholder: "Lieu et informations sur la cérémonie", multiline: true },
  ],
  funeral: [
    { key: "deceased", label: "Nom de la personne honorée", placeholder: "Nom complet" },
    { key: "service", label: "Informations sur les obsèques", placeholder: "Horaires et lieux", multiline: true },
    { key: "tribute", label: "Hommage", placeholder: "Un message à partager avec les proches", multiline: true },
  ],
  birthday: [
    { key: "celebrant", label: "Nom de la personne célébrée", placeholder: "Nom ou prénom" },
    { key: "age", label: "Âge célébré", placeholder: "Ex. 30 ans" },
    { key: "dressCode", label: "Thème ou tenue", placeholder: "Thème de la fête ou code vestimentaire" },
  ],
  training: [
    { key: "trainer", label: "Formateur", placeholder: "Nom et présentation du formateur", multiline: true },
    { key: "audience", label: "Public concerné", placeholder: "À qui s'adresse cette formation ?" },
    { key: "objectives", label: "Objectifs pédagogiques", placeholder: "Compétences abordées pendant la formation", multiline: true },
  ],
  festival: [
    { key: "lineup", label: "Artistes et intervenants", placeholder: "Noms des artistes ou intervenants", multiline: true },
    { key: "program", label: "Programme", placeholder: "Temps forts et horaires", multiline: true },
    { key: "access", label: "Accès et informations pratiques", placeholder: "Transport, accès, consignes", multiline: true },
  ],
};

export type SitePalette = {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

export type SiteTemplateLayout = "centered" | "split" | "overlay" | "minimal";

export type SiteSectionTemplate = {
  type: string;
  content: Record<string, unknown>;
};

export type SiteTemplateDefinition = {
  key: string;
  name: string;
  eventType: SiteEventType;
  kind: "event" | "wedding";
  description: string;
  variant: string;
  layout: SiteTemplateLayout;
  palette: SitePalette;
  sections: SiteSectionTemplate[];
};

type EventTypeMeta = {
  label: string;
  categorySlugs: string[];
  tagline: string;
  storyHeading: string;
  detailsHeading: string;
  ctaLabel: string;
  ctaHeading: string;
  ctaBody: string;
  program?: string;
  quote?: string;
};

export const EVENT_TYPE_META: Record<SiteEventType, EventTypeMeta> = {
  wedding: {
    label: "Mariage",
    categorySlugs: ["mariage", "wedding"],
    tagline: "Deux cœurs, une histoire, un jour inoubliable.",
    storyHeading: "Notre histoire",
    detailsHeading: "Informations pratiques",
    ctaLabel: "Réserver ma place",
    ctaHeading: "Nous avons hâte de célébrer avec vous",
    ctaBody: "Retrouvez toutes les informations et réservez votre place en ligne.",
  },
  contest: {
    label: "Concours",
    categorySlugs: ["concours", "contest"],
    tagline: "Le talent mérite une scène. Le public choisit son champion.",
    storyHeading: "À propos du concours",
    detailsHeading: "Infos pratiques",
    ctaLabel: "Voir le concours",
    ctaHeading: "Soutenez votre candidat favori",
    ctaBody: "Découvrez les candidats, votez et suivez le classement en direct.",
  },
  baptism: {
    label: "Baptême",
    categorySlugs: ["bapteme", "baptême", "baptism"],
    tagline: "Un nouveau départ à célébrer entouré de ceux que l'on aime.",
    storyHeading: "Une journée bénie",
    detailsHeading: "Informations pratiques",
    ctaLabel: "Confirmer ma présence",
    ctaHeading: "Merci de partager ce moment avec nous",
    ctaBody: "Confirmez votre présence et retrouvez le lieu, l'heure et les détails de la cérémonie.",
  },
  funeral: {
    label: "Deuil",
    categorySlugs: ["deuil", "funeral", "obseques", "obsèques"],
    tagline: "Un espace de recueillement et de souvenirs partagés.",
    storyHeading: "En sa mémoire",
    detailsHeading: "Cérémonie",
    ctaLabel: "Laisser un message",
    ctaHeading: "Votre soutien nous touche",
    ctaBody: "Consultez les informations de la cérémonie et partagez un message de soutien.",
  },
  birthday: {
    label: "Anniversaire",
    categorySlugs: ["anniversaire", "birthday"],
    tagline: "Une année de plus, une fête de plus, des souvenirs pour longtemps.",
    storyHeading: "La fête se prépare",
    detailsHeading: "Quand et où ?",
    ctaLabel: "Réviser mon invitation",
    ctaHeading: "Venez nombreux faire la fête",
    ctaBody: "Confirmez votre présence et retrouvez le programme de la journée.",
  },
  training: {
    label: "Formation",
    categorySlugs: ["formation", "training"],
    tagline: "Apprendre, pratiquer et repartir avec des compétences concrètes.",
    storyHeading: "À propos de la formation",
    detailsHeading: "Infos pratiques",
    ctaLabel: "S'inscrire à la formation",
    ctaHeading: "Prêt à monter en compétences ?",
    ctaBody: "Réservez votre place et retrouvez le programme détaillé de la formation.",
    program:
      "Accueil et présentation — Ateliers pratiques — Études de cas — Questions / réponses — Remise des attestations.",
  },
  festival: {
    label: "Festival",
    categorySlugs: ["festival"],
    tagline: "Des sons, des rencontres et une énergie qui vous transporte.",
    storyHeading: "Le festival",
    detailsHeading: "Infos pratiques",
    ctaLabel: "Prendre mes billets",
    ctaHeading: "La scène vous attend",
    ctaBody: "Découvrez la programmation et réservez votre pass pour vivre l'expérience en entier.",
    program:
      "Ouverture des portes — Premières parties — Scène principale — DJ set de clôture.",
  },
};

export type SiteFaqItem = { question: string; answer: string };

/**
 * Contenu de la section « Questions fréquentes ». Ces réponses sont génériques
 * et sûres : elles n'inventent aucune information factuelle sur l'événement.
 */
export const SITE_FAQ: Record<SiteEventType, SiteFaqItem[]> = {
  wedding: [
    {
      question: "Comment confirmer ma présence ?",
      answer:
        "Utilisez le module de confirmation présent sur cette page. Vous pouvez aussi contacter directement les organisateurs si vous avez la moindre question.",
    },
    {
      question: "Y a-t-il un code vestimentaire ?",
      answer:
        "Les indications de tenue sont précisées dans la section Informations. En cas de doute, une tenue élégante et confortable est toujours la bienvenue.",
    },
    {
      question: "Puis-je venir accompagné ?",
      answer:
        "Oui, merci d'indiquer le nombre de personnes lors de votre confirmation afin que nous puissions préparer l'accueil dans les meilleures conditions.",
    },
  ],
  contest: [
    {
      question: "Comment voter pour un candidat ?",
      answer:
        "Les votes se font en ligne depuis la page du concours. Chaque vote est vérifié afin de garantir l'équité du classement.",
    },
    {
      question: "Comment participer au concours ?",
      answer:
        "Les modalités d'inscription et la date limite sont détaillées dans la section Informations. Les candidatures sont étudiées par l'organisation.",
    },
    {
      question: "Quand les résultats sont-ils annoncés ?",
      answer:
        "Le classement final est publié à l'issue de la période de vote. Les gagnants sont également contactés directement par l'organisation.",
    },
  ],
  baptism: [
    {
      question: "Comment confirmer ma présence ?",
      answer:
        "Un module de confirmation est disponible sur cette page. Votre réponse nous aide à préparer la cérémonie et le repas dans les meilleures conditions.",
    },
    {
      question: "Puis-je venir avec des enfants ?",
      answer:
        "Bien sûr. N'hésitez pas à préciser le nombre d'enfants lors de votre confirmation pour que nous prévoyions l'espace nécessaire.",
    },
    {
      question: "Faut-il prévoir un cadeau ?",
      answer:
        "Votre présence est déjà un immense cadeau. Si vous le souhaitez, un mot dans le livre d'or nous touchera profondément.",
    },
  ],
  funeral: [],
  birthday: [
    {
      question: "Comment confirmer ma présence ?",
      answer:
        "Merci de confirmer votre venue depuis cette page avant la date indiquée. Cela nous permet de réserver les tables et d'organiser le buffet.",
    },
    {
      question: "Puis-je venir avec des enfants ?",
      answer:
        "Oui, précisez simplement le nombre d'enfants dans votre confirmation afin que nous prévoyions de quoi les accueillir confortablement.",
    },
    {
      question: "Y a-t-il un thème ou une tenue à respecter ?",
      answer:
        "Le thème et le code vestimentaire sont indiqués dans la section Informations. L'important reste de venir avec le sourire et l'envie de faire la fête.",
    },
  ],
  training: [
    {
      question: "Comment m'inscrire ?",
      answer:
        "Les inscriptions se font depuis cette page, dans la limite des places disponibles. Vous recevrez une confirmation avec les informations pratiques.",
    },
    {
      question: "Faut-il apporter du matériel ?",
      answer:
        "Un ordinateur portable est recommandé pour les ateliers pratiques. Le support de formation et les connexions sont fournis sur place.",
    },
    {
      question: "Une attestation est-elle remise ?",
      answer:
        "Oui, une attestation de participation est remise à la fin de la formation, après validation des ateliers pratiques.",
    },
  ],
  festival: [
    {
      question: "Comment accéder au site du festival ?",
      answer:
        "Les informations d'accès, les navettes et le parking sont détaillés dans la section Informations pratiques ci-dessus.",
    },
    {
      question: "Y a-t-il une consigne sur place ?",
      answer:
        "Oui, une consigne est disponible à l'entrée du site. Les objets interdits sont précisés dans le règlement affiché aux portes.",
    },
    {
      question: "Les horaires peuvent-ils changer ?",
      answer:
        "La programmation est donnée à titre indicatif et peut évoluer. Suivez les communications officielles de l'organisation le jour de l'événement.",
    },
  ],
};

/** Conseils d'accès, volontairement neutres pour rester valables partout. */
export const SITE_VENUE_NOTES: Record<SiteEventType, string> = {
  wedding: "Privilégiez le covoiturage et prévoyez d'arriver quinze minutes avant la cérémonie.",
  contest: "Les portes ouvrent une heure avant le début. Les places sont numérotées.",
  baptism: "Merci d'arriver dix minutes avant la cérémonie afin de faciliter l'accueil des invités.",
  funeral: "Un espace de recueillement est prévu à l'entrée pour les messages de condoléances.",
  birthday: "L'accès se fait par l'entrée principale. Une pièce d'identité peut être demandée.",
  training: "L'accueil se fait dès 8h00 avec un café. Apportez un ordinateur portable si vous en avez un.",
  festival: "Navettes, parking et consigne sont indiqués ci-dessous. Pensez à arriver tôt pour éviter l'affluence.",
};

/**
 * Texte d'introduction utilisé quand l'organisateur n'a pas encore rédigé de
 * description : le site reste chaleureux et complet sans inventer de faits.
 */
export const SITE_INTRO: Record<SiteEventType, string> = {
  wedding:
    "C'est avec une immense joie que nous vous convions à célébrer notre union. Entourés de nos familles et de nos amis, nous vous donnons rendez-vous pour une journée placée sous le signe de l'amour et du partage.",
  contest:
    "Le concours met en lumière des talents venus de tous horizons. Découvrez les candidats, suivez leurs performances et soutenez votre favori tout au long de la compétition.",
  baptism:
    "Nous vous invitons à partager un moment de grâce et de joie autour de notre enfant. Votre présence à nos côtés donnera à cette journée toute sa douceur.",
  funeral:
    "Nous vous invitons à nous accompagner dans le recueillement et à partager vos souvenirs. Chaque mot et chaque présence comptent pour la famille et les proches.",
  birthday:
    "Une nouvelle année commence, et nous avons envie de la célébrer avec vous. Préparez-vous à une soirée pleine de rires, de musique et de bons souvenirs.",
  training:
    "Cette formation a été conçue pour vous apporter des méthodes concrètes, applicables dès le lendemain. Le programme alterne apports théoriques, ateliers pratiques et temps d'échange.",
  festival:
    "Des scènes, des artistes et des rencontres : cette édition a été pensée pour vous faire vibrer du premier au dernier morceau. Découvrez la programmation et préparez votre venue.",
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Déduit le type de site à partir du slug ou du nom de la catégorie de
 * l'événement. Seuls les sept types du catalogue sont reconnus.
 */
export function resolveSiteEventType(
  ...values: Array<string | null | undefined>
): SiteEventType | null {
  const mapping: Record<string, SiteEventType> = {
    mariage: "wedding",
    wedding: "wedding",
    concours: "contest",
    contest: "contest",
    bapteme: "baptism",
    baptism: "baptism",
    deuil: "funeral",
    funeral: "funeral",
    obseques: "funeral",
    anniversaire: "birthday",
    birthday: "birthday",
    formation: "training",
    training: "training",
    festival: "festival",
  };

  for (const value of values) {
    if (!value) continue;
    const normalized = normalize(value);
    if (!normalized) continue;
    if (mapping[normalized]) return mapping[normalized];

    for (const [needle, type] of Object.entries(mapping)) {
      if (normalized.includes(needle)) return type;
    }
  }

  return null;
}

export const SITE_PALETTES: Array<{ id: string; label: string; palette: SitePalette }> = [
  {
    id: "royal",
    label: "Bleu royal",
    palette: {
      primaryColor: "#1d4ed8",
      accentColor: "#f59e0b",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
    },
  },
  {
    id: "ivoire",
    label: "Ivoire & or",
    palette: {
      primaryColor: "#8a6a2f",
      accentColor: "#d4af37",
      backgroundColor: "#fffaf0",
      textColor: "#2f2415",
    },
  },
  {
    id: "rose",
    label: "Rose poudré",
    palette: {
      primaryColor: "#be185d",
      accentColor: "#f9a8d4",
      backgroundColor: "#fff7fb",
      textColor: "#3f1728",
    },
  },
  {
    id: "emeraude",
    label: "Émeraude",
    palette: {
      primaryColor: "#047857",
      accentColor: "#fbbf24",
      backgroundColor: "#f3fbf6",
      textColor: "#052e22",
    },
  },
  {
    id: "ocean",
    label: "Océan",
    palette: {
      primaryColor: "#0e7490",
      accentColor: "#22d3ee",
      backgroundColor: "#f0fdfa",
      textColor: "#083344",
    },
  },
  {
    id: "sunset",
    label: "Coucher de soleil",
    palette: {
      primaryColor: "#c2410c",
      accentColor: "#fb923c",
      backgroundColor: "#fff7ed",
      textColor: "#431407",
    },
  },
  {
    id: "nuit",
    label: "Nuit profonde",
    palette: {
      primaryColor: "#7c3aed",
      accentColor: "#facc15",
      backgroundColor: "#0f0b1e",
      textColor: "#f8fafc",
    },
  },
  {
    id: "lavande",
    label: "Lavande",
    palette: {
      primaryColor: "#6d28d9",
      accentColor: "#c4b5fd",
      backgroundColor: "#faf5ff",
      textColor: "#2e1065",
    },
  },
];

type VariantDefinition = {
  key: string;
  name: string;
  description: string;
  layout: SiteTemplateLayout;
  palette: SitePalette;
};

const VARIANTS: Record<SiteEventType, VariantDefinition[]> = {
  wedding: [
    {
      key: "elegance",
      name: "Élégance",
      description: "Une mise en page raffinée, centrée et intemporelle.",
      layout: "centered",
      palette: SITE_PALETTES[1].palette,
    },
    {
      key: "boheme",
      name: "Bohème",
      description: "Des tons chaleureux et une présentation en pleine largeur.",
      layout: "split",
      palette: SITE_PALETTES[2].palette,
    },
    {
      key: "royal",
      name: "Royal",
      description: "Un hero immersif avec une ambiance nocturne et dorée.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
  ],
  contest: [
    {
      key: "scene",
      name: "Scène",
      description: "Un modèle énergique qui met les candidats en avant.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
    {
      key: "podium",
      name: "Podium",
      description: "Une présentation dynamique pour les concours et votes.",
      layout: "split",
      palette: SITE_PALETTES[0].palette,
    },
    {
      key: "studio",
      name: "Studio",
      description: "Un design moderne et épuré pour les concours créatifs.",
      layout: "minimal",
      palette: SITE_PALETTES[4].palette,
    },
  ],
  baptism: [
    {
      key: "celeste",
      name: "Céleste",
      description: "Une ambiance douce et lumineuse pour un jour béni.",
      layout: "centered",
      palette: SITE_PALETTES[4].palette,
    },
    {
      key: "pastel",
      name: "Pastel",
      description: "Des couleurs tendres et une présentation aérée.",
      layout: "split",
      palette: SITE_PALETTES[7].palette,
    },
    {
      key: "lumiere",
      name: "Lumière",
      description: "Un rendu chaleureux et intime, centré sur l'émotion.",
      layout: "minimal",
      palette: SITE_PALETTES[1].palette,
    },
  ],
  funeral: [
    {
      key: "hommage",
      name: "Hommage",
      description: "Un espace sobre et digne pour recueillir les souvenirs.",
      layout: "centered",
      palette: SITE_PALETTES[5].palette,
    },
    {
      key: "serenite",
      name: "Sérénité",
      description: "Une présentation calme, douce et respectueuse.",
      layout: "minimal",
      palette: SITE_PALETTES[4].palette,
    },
    {
      key: "souvenir",
      name: "Souvenir",
      description: "Un modèle sombre et apaisant pour un dernier hommage.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
  ],
  birthday: [
    {
      key: "confettis",
      name: "Confettis",
      description: "Des couleurs pétillantes pour une fête mémorable.",
      layout: "split",
      palette: SITE_PALETTES[2].palette,
    },
    {
      key: "neon",
      name: "Néon",
      description: "Une ambiance lumineuse et festive, parfaite pour la nuit.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
    {
      key: "douceur",
      name: "Douceur",
      description: "Un modèle tendre et chaleureux pour un anniversaire intime.",
      layout: "centered",
      palette: SITE_PALETTES[5].palette,
    },
  ],
  training: [
    {
      key: "academie",
      name: "Académie",
      description: "Un site structuré pour présenter un programme de formation.",
      layout: "split",
      palette: SITE_PALETTES[0].palette,
    },
    {
      key: "atelier",
      name: "Atelier",
      description: "Un rendu pratique et chaleureux, centré sur l'apprentissage.",
      layout: "minimal",
      palette: SITE_PALETTES[3].palette,
    },
    {
      key: "masterclass",
      name: "Masterclass",
      description: "Une présentation premium pour les formations d'exception.",
      layout: "centered",
      palette: SITE_PALETTES[7].palette,
    },
  ],
  festival: [
    {
      key: "afrobeat",
      name: "Afrobeat",
      description: "Des couleurs solaires et une énergie communicative.",
      layout: "overlay",
      palette: SITE_PALETTES[5].palette,
    },
    {
      key: "sunset",
      name: "Sunset",
      description: "Une ambiance chaleureuse pour les festivals en plein air.",
      layout: "split",
      palette: SITE_PALETTES[2].palette,
    },
    {
      key: "underground",
      name: "Underground",
      description: "Un design sombre et intense pour les scènes alternatives.",
      layout: "minimal",
      palette: SITE_PALETTES[6].palette,
    },
  ],
};

function buildSections(eventType: SiteEventType): SiteSectionTemplate[] {
  const meta = EVENT_TYPE_META[eventType];

  const hero: SiteSectionTemplate = {
    type: "hero",
    content: {
      eyebrow: "{{event.typeLabel}}",
      title: "{{event.title}}",
      subtitle: meta.tagline,
      date: "{{event.date}}",
      time: "{{event.time}}",
      location: "{{event.location}}",
      image: "{{event.coverUrl}}",
      ctaLabel: meta.ctaLabel,
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const story: SiteSectionTemplate = {
    type: "story",
    content: {
      heading: meta.storyHeading,
      body: "{{event.description}}",
    },
  };

  const details: SiteSectionTemplate = {
    type: "details",
    content: {
      heading: meta.detailsHeading,
      date: "{{event.date}}",
      time: "{{event.time}}",
      venue: "{{event.venue}}",
      address: "{{event.address}}",
      city: "{{event.city}}",
    },
  };

  const gallery: SiteSectionTemplate = {
    type: "gallery",
    content: {
      heading: "Galerie",
      image: "{{event.coverUrl}}",
    },
  };

  const tickets: SiteSectionTemplate = {
    type: "tickets",
    content: {
      heading: "Billetterie",
      body: "Réservez votre place en quelques clics, directement en ligne.",
      ctaLabel: "Voir les billets",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const cta: SiteSectionTemplate = {
    type: "cta",
    content: {
      heading: meta.ctaHeading,
      body: meta.ctaBody,
      ctaLabel: meta.ctaLabel,
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const program: SiteSectionTemplate = {
    type: "program",
    content: {
      heading: "Programme",
      body: meta.program ?? "",
    },
  };

  const quote: SiteSectionTemplate = {
    type: "quote",
    content: {
      text: "Ceux que nous aimons ne nous quittent jamais vraiment.",
      author: "En leur mémoire",
    },
  };

  const guestbook: SiteSectionTemplate = {
    type: "guestbook",
    content: {
      heading: "Livre d'or",
      body: "Partagez un message, un souvenir ou un mot de soutien.",
      ctaLabel: "Laisser un message",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const contest: SiteSectionTemplate = {
    type: "contest",
    content: {
      heading: "Les candidats",
      body: "Découvrez les talents en compétition et votez pour votre favori.",
      ctaLabel: "Voir les candidats",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const rsvp: SiteSectionTemplate = {
    type: "rsvp",
    content: {
      heading: "Confirmer ma présence",
      body: "Votre présence compte pour nous. Merci de confirmer votre venue.",
      ctaLabel: "Je confirme",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const venue: SiteSectionTemplate = {
    type: "venue",
    content: {
      heading: "Accès & informations pratiques",
      body: "Tout ce qu'il faut savoir pour arriver sereinement : adresse exacte, stationnement et conseils d'accès.",
      venue: "{{event.venue}}",
      address: "{{event.address}}",
      city: "{{event.city}}",
      note: SITE_VENUE_NOTES[eventType],
    },
  };

  const faqItems = SITE_FAQ[eventType];
  const faq: SiteSectionTemplate = {
    type: "faq",
    content: {
      heading: "Questions fréquentes",
      body: "Les réponses aux questions que vous nous posez le plus souvent.",
      items: faqItems,
    },
  };

  switch (eventType) {
    case "wedding":
      return [hero, story, details, venue, gallery, faq, rsvp, cta];
    case "contest":
      return [hero, story, contest, details, venue, gallery, faq, tickets, cta];
    case "baptism":
      return [hero, story, details, venue, gallery, faq, guestbook, cta];
    case "funeral":
      return [hero, quote, story, details, venue, gallery, guestbook, cta];
    case "birthday":
      return [hero, story, details, venue, gallery, faq, tickets, cta];
    case "training":
      return [hero, story, program, details, venue, faq, tickets, cta];
    case "festival":
      return [hero, story, program, details, venue, gallery, faq, tickets, cta];
  }
}

export const SITE_TEMPLATES: SiteTemplateDefinition[] = SITE_EVENT_TYPES.flatMap((eventType) =>
  VARIANTS[eventType].map((variant) => ({
    key: `${eventType}-${variant.key}`,
    name: variant.name,
    eventType,
    kind: eventType === "wedding" ? "wedding" : "event",
    description: variant.description,
    variant: variant.key,
    layout: variant.layout,
    palette: variant.palette,
    sections: buildSections(eventType),
  })),
);

export const SITE_TEMPLATE_BY_KEY = new Map(SITE_TEMPLATES.map((template) => [template.key, template]));

export function getEventTypeMeta(eventType: SiteEventType): EventTypeMeta {
  return EVENT_TYPE_META[eventType];
}
