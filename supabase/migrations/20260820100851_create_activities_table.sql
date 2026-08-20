/*
# Create activities table (single-tenant, no auth)

1. New Tables
- `activities`
  - `id` (uuid, primary key)
  - `tool` (text, not null) — which tool generated the activity: 'email' | 'meeting' | 'task'
  - `title` (text, not null) — short human-readable label for the activity
  - `summary` (text, optional) — brief description of what was generated
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `activities`.
- Allow anon + authenticated CRUD because this is a single-tenant no-auth app
  where all activity history is intentionally shared/public.

3. Notes
- No user_id column since the app has no sign-in screen.
- Activity rows are created whenever a user generates content with any tool.
*/
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text NOT NULL,
  title text NOT NULL,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_activities" ON activities;
CREATE POLICY "anon_select_activities" ON activities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_activities" ON activities;
CREATE POLICY "anon_insert_activities" ON activities FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_activities" ON activities;
CREATE POLICY "anon_update_activities" ON activities FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_activities" ON activities;
CREATE POLICY "anon_delete_activities" ON activities FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities (created_at DESC);
