-- Add plan tracking and usage columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS current_plan TEXT DEFAULT 'drishti' CHECK (current_plan IN ('drishti', 'sparsh', 'sangam', 'samarpan')),
ADD COLUMN IF NOT EXISTS daily_swipes_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_swipes_limit INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS last_swipe_reset TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS super_likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS message_highlights_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_visibility_boost BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS favorite_quote TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_current_plan ON users(current_plan);
CREATE INDEX IF NOT EXISTS idx_users_last_swipe_reset ON users(last_swipe_reset);
CREATE INDEX IF NOT EXISTS idx_users_plan_expires_at ON users(plan_expires_at);

-- Create function to reset daily swipes
CREATE OR REPLACE FUNCTION reset_daily_swipes()
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET daily_swipes_used = 0,
        last_swipe_reset = NOW()
    WHERE DATE(last_swipe_reset) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to reset daily swipes (this would typically be done via cron or a scheduler)
-- For now, we'll create a trigger that checks on each swipe action
