-- Create bookmarks table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
-- SELECT: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can only add bookmarks for themselves
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- Enable Realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
