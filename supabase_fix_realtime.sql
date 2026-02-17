-- 1. Add missing UPDATE policy
-- This ensures that update events can be tracked and filtered correctly by RLS for Realtime.
CREATE POLICY "Users can update their own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Enhance Replication Identity
-- Setting this to FULL ensures that the Realtime payload contains all columns,
-- which helps with identifying rows during updates and deletes in complex scenarios.
ALTER TABLE bookmarks REPLICA IDENTITY FULL;

-- 3. Re-verify Realtime Publication
-- Ensure the table is definitely in the publication. 
-- If it's already there, this will just confirm it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'bookmarks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
  END IF;
END $$;
