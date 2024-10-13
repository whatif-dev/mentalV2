-- Update patients table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip TEXT;

-- Update billing table
ALTER TABLE billing
DROP COLUMN IF EXISTS responsible_party,
DROP COLUMN IF EXISTS insurance_info,
ADD COLUMN IF NOT EXISTS responsible_party JSONB,
ADD COLUMN IF NOT EXISTS insurance_info JSONB;

-- Add comments
COMMENT ON COLUMN patients.gender IS 'Patient''s gender';
COMMENT ON COLUMN patients.phone IS 'Patient''s phone number';
COMMENT ON COLUMN patients.email IS 'Patient''s email address';
COMMENT ON COLUMN patients.address IS 'Patient''s street address';
COMMENT ON COLUMN patients.city IS 'Patient''s city';
COMMENT ON COLUMN patients.state IS 'Patient''s state';
COMMENT ON COLUMN patients.zip IS 'Patient''s ZIP code';
COMMENT ON COLUMN billing.responsible_party IS 'JSON object containing responsible party information';
COMMENT ON COLUMN billing.insurance_info IS 'JSON object containing insurance information';