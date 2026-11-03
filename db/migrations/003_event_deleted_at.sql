ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
