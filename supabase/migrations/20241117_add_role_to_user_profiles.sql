-- Add role field to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update existing admin user if exists
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@gmail.com';

-- Grant permissions for the new column
GRANT SELECT, INSERT, UPDATE ON user_profiles TO anon, authenticated;