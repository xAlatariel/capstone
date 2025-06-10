-- ===================================================================
-- DATABASE INITIALIZATION SCRIPT FOR AI CANIPAI
-- ===================================================================

-- Set timezone
SET timezone = 'Europe/Rome';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===================================================================
-- STORED PROCEDURES AND FUNCTIONS
-- ===================================================================

-- Function to clean expired tokens
CREATE OR REPLACE FUNCTION clean_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_verification_tokens 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get reservation statistics
CREATE OR REPLACE FUNCTION get_reservation_stats(
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE DEFAULT CURRENT_DATE + INTERVAL '30 days'
)
RETURNS TABLE(
    total_reservations BIGINT,
    total_people INTEGER,
    indoor_reservations BIGINT,
    outdoor_reservations BIGINT,
    avg_party_size NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_reservations,
        COALESCE(SUM(number_of_people), 0)::INTEGER as total_people,
        COUNT(CASE WHEN reservation_area = 'INDOOR' THEN 1 END)::BIGINT as indoor_reservations,
        COUNT(CASE WHEN reservation_area = 'OUTDOOR' THEN 1 END)::BIGINT as outdoor_reservations,
        ROUND(AVG(number_of_people), 2) as avg_party_size
    FROM table_reservations
    WHERE reservation_date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- TRIGGERS
-- ===================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- PERFORMANCE OPTIMIZATION
-- ===================================================================

-- Set optimal PostgreSQL settings for restaurant workload
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Reload configuration
SELECT pg_reload_conf();

-- ===================================================================
-- SECURITY SETTINGS
-- ===================================================================

-- Create read-only user for monitoring
CREATE USER monitoring WITH PASSWORD 'monitoring_password_change_me';
GRANT CONNECT ON DATABASE aicanipai_prod TO monitoring;
GRANT USAGE ON SCHEMA public TO monitoring;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitoring;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO monitoring;

-- ===================================================================
-- LOGGING AND MONITORING
-- ===================================================================

-- Enable query logging for slow queries (>1 second)
ALTER SYSTEM SET log_min_duration_statement = '1000';
ALTER SYSTEM SET log_statement = 'none';
ALTER SYSTEM SET log_duration = 'off';
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';

COMMIT;