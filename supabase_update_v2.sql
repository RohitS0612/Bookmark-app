-- Add image_url column to bookmarks table
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS image_url TEXT;
