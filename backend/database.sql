-- Create database
CREATE DATABASE IF NOT EXISTS masjid_db;
USE masjid_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Prayer schedules table
CREATE TABLE IF NOT EXISTS prayer_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    subuh TIME NOT NULL,
    dzuhur TIME NOT NULL,
    ashar TIME NOT NULL,
    maghrib TIME NOT NULL,
    isya TIME NOT NULL,
    location VARCHAR(255) DEFAULT 'Jakarta, Indonesia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Information table
CREATE TABLE IF NOT EXISTS information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('profile', 'kegiatan', 'kontak', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Finances table
CREATE TABLE IF NOT EXISTS finances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_type (type)
);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created (created_at)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, name, role) VALUES 
('admin', '$2a$10$YourHashedPasswordHere', 'Administrator', 'admin');

-- Insert sample prayer schedule
INSERT INTO prayer_schedules (date, subuh, dzuhur, ashar, maghrib, isya, location) VALUES
('2026-02-10', '04:30:00', '12:00:00', '15:30:00', '18:00:00', '19:30:00', 'Jakarta, Indonesia');

-- Insert sample information
INSERT INTO information (title, content, category) VALUES
('Profil Masjid', 'Masjid At-Tauhid didirikan pada tahun 2005...', 'profile'),
('Kegiatan Rutin', 'Setiap hari Jumat: Kajian Subuh & Kultum Dzuhur...', 'kegiatan'),
('Kontak & Lokasi', 'Alamat: Jl. Masjid At-Tauhid No. 123, Jakarta...', 'kontak');

-- Insert sample finances
INSERT INTO finances (date, type, amount, source, description) VALUES
('2026-02-01', 'income', 5000000, 'Zakat', 'Awal bulan'),
('2026-02-03', 'expense', 1200000, 'Listrik & Air', 'Tagihan bulanan');

-- Insert sample news
INSERT INTO news (title, content, image_url) VALUES
('Kajian Subuh Spesial', 'Masjid At-Tauhid mengadakan kajian subuh...', NULL),
('Peresmian Taman Baca', 'Taman baca baru di kompleks masjid...', NULL);