-- Creates the application schema on first database initialization.
-- This file is mounted into the postgres container's /docker-entrypoint-initdb.d/
-- directory and runs automatically when the pgdata volume is first created.
CREATE SCHEMA IF NOT EXISTS manageit;
