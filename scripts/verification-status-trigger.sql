-- Automatically update verification_status when the phone is verified
CREATE OR REPLACE FUNCTION set_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mobile_verified = TRUE THEN
    NEW.verification_status := 'verified';
  ELSIF NEW.verification_status IS NULL THEN
    NEW.verification_status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_verification_status ON users;
CREATE TRIGGER trigger_set_verification_status
  BEFORE INSERT OR UPDATE OF mobile_verified ON users
  FOR EACH ROW EXECUTE FUNCTION set_verification_status();
