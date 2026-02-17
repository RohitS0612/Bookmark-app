-- Add is_favorite column to bookmarks
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
