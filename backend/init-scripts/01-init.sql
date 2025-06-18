-- Initialize BarSan Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create additional extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance (will be created after Prisma migrations)
-- These are just examples, Prisma will handle most indexing

-- Set timezone
SET timezone = 'Asia/Bangkok';

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE barsan_db TO barsan_user;
