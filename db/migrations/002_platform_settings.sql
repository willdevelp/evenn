-- Réglages publics et plateforme consommés par le footer, les tarifs et les paramètres.
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text REFERENCES public."user"(id) ON DELETE SET NULL
);
