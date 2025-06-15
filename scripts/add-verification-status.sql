-- Add verification_status column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- Ensure allowed values
ALTER TABLE users
  ADD CONSTRAINT IF NOT EXISTS users_verification_status_check
  CHECK (verification_status IN ('pending','verified','rejected'));

-- Verification is determined manually from the admin panel. Phone verification
-- does not automatically mark a user as verified, so we do not update existing
-- records here.

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);

-- Add comment for documentation
COMMENT ON COLUMN users.verification_status IS 'Account review status: pending, verified, or rejected';
