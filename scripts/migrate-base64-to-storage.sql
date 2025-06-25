-- Migration script to move existing base64 images to proper storage
-- This is a one-time migration script

-- First, let's see how many users have base64 images
SELECT 
  COUNT(*) as total_users_with_photos,
  COUNT(CASE WHEN user_photos::text LIKE '%data:image%' THEN 1 END) as users_with_base64
FROM users 
WHERE user_photos IS NOT NULL AND array_length(user_photos, 1) > 0;

-- Create a temporary table to track migration progress
CREATE TABLE IF NOT EXISTS photo_migration_log (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  old_photo_count INTEGER,
  new_photo_count INTEGER,
  migration_status TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Note: The actual base64 to storage migration would need to be done
-- via a server-side script since we can't decode base64 in SQL
-- This script just prepares the tracking table

-- Clean up any null or empty photo arrays
UPDATE users 
SET user_photos = '{}' 
WHERE user_photos IS NULL OR user_photos = '{}' OR array_length(user_photos, 1) = 0;
