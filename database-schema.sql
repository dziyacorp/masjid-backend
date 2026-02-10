-- Create tables for PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(10) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prayer_schedules (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    subuh TIME NOT NULL,
    dzuhur TIME NOT NULL,
    ashar TIME NOT NULL,
    maghrib TIME NOT NULL,
    isya TIME NOT NULL,
    location VARCHAR(255) DEFAULT 'Jakarta, Indonesia',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE information (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finances (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user (password: admin123 - you should hash this properly)
INSERT INTO users (username, password, name, role) VALUES 
('admin', '$2a$10$9d2nttLQr2YqF7K8QhEg4uG4oQY5k2jX5k2jX5k2jX5k2jX5k2jX5', 'Administrator', 'admin');

-- Insert sample prayer schedule
INSERT INTO prayer_schedules (date, subuh, dzuhur, ashar, maghrib, isya, location) VALUES
('2026-02-10', '04:30:00', '12:00:00', '15:30:00', '18:00:00', '19:30:00', 'Jakarta, Indonesia');
