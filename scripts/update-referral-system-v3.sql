-- Update referral system to handle verification-based rewards
-- This script updates the existing referral system with new reward structure

-- Update the referral completion trigger to only count verified users
CREATE OR REPLACE FUNCTION process_referral_completion() RETURNS TRIGGER AS $$
BEGIN
    -- Only process if user becomes verified
    IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
        -- Update referral status to completed for this user
        UPDATE referrals 
        SET status = 'completed', 
            completed_at = NOW(),
            updated_at = NOW()
        WHERE referred_id = NEW.id 
        AND status = 'pending';
        
        -- Update referrer's successful referral count
        UPDATE users 
        SET referral_count = (
            SELECT COUNT(*) 
            FROM referrals r 
            JOIN users u ON r.referred_id = u.id 
            WHERE r.referrer_id = users.id 
            AND r.status = 'completed' 
            AND u.verification_status = 'verified'
        ),
        updated_at = NOW()
        WHERE id IN (
            SELECT referrer_id 
            FROM referrals 
            WHERE referred_id = NEW.id 
            AND status = 'completed'
        );
        
        -- Check and award rewards based on successful referrals
        DECLARE
            referrer_id UUID;
            successful_count INTEGER;
        BEGIN
            -- Get referrer info
            SELECT r.referrer_id INTO referrer_id
            FROM referrals r 
            WHERE r.referred_id = NEW.id 
            AND r.status = 'completed'
            LIMIT 1;
            
            IF referrer_id IS NOT NULL THEN
                -- Get current successful referral count
                SELECT COUNT(*) INTO successful_count
                FROM referrals r 
                JOIN users u ON r.referred_id = u.id 
                WHERE r.referrer_id = referrer_id 
                AND r.status = 'completed' 
                AND u.verification_status = 'verified';
                
                -- Award Fast Track Verification (4 referrals)
                IF successful_count >= 4 THEN
                    UPDATE users 
                    SET fast_track_verification = TRUE,
                        updated_at = NOW()
                    WHERE id = referrer_id 
                    AND fast_track_verification = FALSE;
                    
                    INSERT INTO refer
