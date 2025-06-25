-- Add columns to track SMS and email delivery status
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS sms_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_details TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_delivery_status ON notifications(delivery_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- Update existing notifications to have proper status
UPDATE notifications 
SET delivery_status = 'sent' 
WHERE delivery_status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';
