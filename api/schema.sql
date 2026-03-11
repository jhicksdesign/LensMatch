-- LensMatch Database Schema
-- Run this in Neon.tech SQL Editor, or hit POST /api/setup?secret=YOUR_SETUP_SECRET

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS photographers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  styles TEXT[] DEFAULT '{}',
  min_budget INTEGER DEFAULT 500,
  available_dates TEXT[] DEFAULT '{}',
  location TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  rating FLOAT DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  photographer_id TEXT NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  style TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  selected_styles TEXT[] DEFAULT '{}',
  budget INTEGER NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  match_score FLOAT,
  status TEXT DEFAULT 'NEW',
  photographer_id TEXT REFERENCES photographers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_photographer ON photos(photographer_id);
CREATE INDEX IF NOT EXISTS idx_leads_photographer ON leads(photographer_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
