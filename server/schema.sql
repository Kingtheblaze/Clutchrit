-- server/schema.sql
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Members Table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    photo TEXT,
    role TEXT,
    year TEXT,
    branch TEXT,
    games JSONB DEFAULT '[]'::jsonb,
    bio TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    is_executive BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    banner_image TEXT,
    game TEXT,
    event_type TEXT,
    date DATE NOT NULL,
    time TEXT,
    venue TEXT,
    registration_link TEXT,
    status TEXT DEFAULT 'upcoming',
    prize_pool TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    is_pinned BOOLEAN DEFAULT FALSE,
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
