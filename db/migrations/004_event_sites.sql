-- Site web personnalisé rattaché à un événement.
--
-- `sites` existait déjà dans le schéma, mais sans lien vers l'événement.
-- On ajoute donc une colonne nullable (compatible avec les sites existants)
-- et un index unique : un événement ne peut avoir qu'un seul site actif.
ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS sites_event_id_unique
  ON public.sites (event_id)
  WHERE event_id IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS sites_event_id_idx
  ON public.sites (event_id);

-- Catégories d'événements prises en charge par les sites personnalisés.
-- `formation` et `festival` existent déjà ; on complète les cinq autres.
INSERT INTO public.categories (slug, name_fr, name_en, scope, sort_order)
VALUES
  ('mariage', 'Mariage', 'Wedding', 'event', 13),
  ('concours', 'Concours', 'Contest', 'event', 14),
  ('bapteme', 'Baptême', 'Baptism', 'event', 15),
  ('deuil', 'Deuil', 'Funeral', 'event', 16),
  ('anniversaire', 'Anniversaire', 'Birthday', 'event', 17)
ON CONFLICT (scope, slug) DO NOTHING;
