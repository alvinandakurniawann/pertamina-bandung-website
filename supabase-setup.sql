-- =============================================================
-- RESET & SETUP DATABASE DARI NOL (Jalankan di Supabase SQL Editor)
-- =============================================================

-- Extension untuk gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- DROP semua tabel bila ada (urutan dengan CASCADE untuk aman)
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS region_stats CASCADE;
DROP TABLE IF EXISTS changes CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- =============================================================
-- TABEL: settings (untuk menyimpan konfigurasi UI, termasuk map SVG)
-- =============================================================
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  map_svg TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================
-- TABEL: regions (master wilayah). Gunakan ID berbasis slug teks.
-- =============================================================
CREATE TABLE regions (
  id TEXT PRIMARY KEY,              -- contoh: 'kab-bandung', 'kota-bandung'
  name TEXT NOT NULL,               -- nama tampilan
  color TEXT NOT NULL DEFAULT '#3B82F6',
  spbu_count INTEGER NOT NULL DEFAULT 0,  -- cache opsional
  spbe_count INTEGER NOT NULL DEFAULT 0,  -- cache opsional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================
-- TABEL: locations (opsional detail titik lokasi)
-- =============================================================
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id TEXT REFERENCES regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('SPBU','SPBE','PERTASHOP','AGEN_LPG','PANGKALAN')) NOT NULL,
  address TEXT,
  services TEXT[] DEFAULT '{}',
  hours TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================
-- TABEL: changes (audit log sederhana)
-- =============================================================
CREATE TABLE changes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  region_id TEXT,
  location_id TEXT,
  before JSONB,
  after JSONB,
  by TEXT NOT NULL
);

-- =============================================================
-- TABEL: region_stats (aggregat untuk kartu ringkasan per wilayah)
-- =============================================================
CREATE TABLE region_stats (
  key TEXT PRIMARY KEY,           -- contoh: 'ALL', 'kab-bandung', 'kota-bandung'
  display_name TEXT NOT NULL,     -- contoh: 'Semua Wilayah', 'Kabupaten Bandung'
  spbu_total INTEGER NOT NULL DEFAULT 0,
  pertashop_total INTEGER NOT NULL DEFAULT 0,
  spbe_pso_total INTEGER NOT NULL DEFAULT 0,
  spbe_npso_total INTEGER NOT NULL DEFAULT 0,
  agen_lpg_3kg_total INTEGER NOT NULL DEFAULT 0,
  lpg_npso_total INTEGER NOT NULL DEFAULT 0,
  pangkalan_lpg_3kg_total INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================
-- RLS: ENABLE & POLICY (demo: allow all)
-- =============================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE region_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on settings" ON settings;
CREATE POLICY "Allow all on settings" ON settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on regions" ON regions;
CREATE POLICY "Allow all on regions" ON regions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on locations" ON locations;
CREATE POLICY "Allow all on locations" ON locations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on changes" ON changes;
CREATE POLICY "Allow all on changes" ON changes FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on region_stats" ON region_stats;
CREATE POLICY "Allow all on region_stats" ON region_stats FOR ALL USING (true);

-- =============================================================
-- SEED AWAL (silakan sesuaikan dengan data real di kemudian hari)
-- =============================================================

-- Baris konfigurasi UI default
INSERT INTO settings (id, map_svg)
VALUES ('ui', NULL)
ON CONFLICT (id) DO NOTHING;

-- Agregat total seluruh wilayah (sesuai brief)
INSERT INTO region_stats (
  key, display_name,
  spbu_total, pertashop_total, spbe_pso_total, spbe_npso_total,
  agen_lpg_3kg_total, lpg_npso_total, pangkalan_lpg_3kg_total
) VALUES (
  'ALL', 'Semua Wilayah', 328, 116, 42, 10, 422, 42, 10904
) ON CONFLICT (key) DO NOTHING;

-- Contoh per-wilayah (contoh; ganti dengan angka final jika ada)
INSERT INTO region_stats (key, display_name, spbu_total, pertashop_total, spbe_pso_total, spbe_npso_total, agen_lpg_3kg_total, lpg_npso_total, pangkalan_lpg_3kg_total) VALUES
  ('kab-bandung', 'Kabupaten Bandung', 30, 8, 5, 1, 40, 4, 900),
  ('kota-bandung', 'Kota Bandung', 25, 12, 4, 1, 35, 3, 700),
  ('kab-garut', 'Kabupaten Garut', 28, 10, 3, 1, 36, 3, 820),
  ('kab-sumedang', 'Kabupaten Sumedang', 15, 7, 2, 0, 20, 2, 500),
  ('kab-tasikmalaya', 'Kabupaten Tasikmalaya', 22, 9, 3, 1, 33, 3, 780),
  ('kota-tasikmalaya', 'Kota Tasikmalaya', 12, 5, 1, 0, 14, 1, 420),
  ('kab-ciamis', 'Kabupaten Ciamis', 18, 6, 2, 0, 21, 2, 650),
  ('kab-pangandaran', 'Kabupaten Pangandaran', 10, 4, 1, 0, 12, 1, 300),
  ('kota-banjar', 'Kota Banjar', 6, 3, 1, 0, 8, 1, 220),
  ('kab-bandung-barat', 'Kabupaten Bandung Barat', 20, 7, 2, 0, 25, 2, 600),
  ('kota-cimahi', 'Kota Cimahi', 10, 5, 2, 0, 12, 1, 350)
ON CONFLICT (key) DO NOTHING;

-- Contoh master regions (opsional, membantu relasi ke locations)
INSERT INTO regions (id, name, color) VALUES
  ('kab-bandung', 'Kabupaten Bandung', '#5FBCD3'),
  ('kota-bandung', 'Kota Bandung', '#37C871'),
  ('kab-garut', 'Kabupaten Garut', '#FF80B2'),
  ('kab-sumedang', 'Kabupaten Sumedang', '#B3FF80'),
  ('kab-tasikmalaya', 'Kabupaten Tasikmalaya', '#2A82BF'),
  ('kota-tasikmalaya', 'Kota Tasikmalaya', '#2A82BF'),
  ('kab-ciamis', 'Kabupaten Ciamis', '#2A82BF'),
  ('kab-pangandaran', 'Kabupaten Pangandaran', '#2A82BF'),
  ('kota-banjar', 'Kota Banjar', '#2A82BF'),
  ('kab-bandung-barat', 'Kabupaten Bandung Barat', '#2A82BF'),
  ('kota-cimahi', 'Kota Cimahi', '#2A82BF')
ON CONFLICT (id) DO NOTHING;

-- (Opsional) Sinkronisasi count cache pada regions dari tabel locations
UPDATE regions SET
  spbu_count = COALESCE((SELECT COUNT(*) FROM locations WHERE locations.region_id = regions.id AND type = 'SPBU'),0),
  spbe_count = COALESCE((SELECT COUNT(*) FROM locations WHERE locations.region_id = regions.id AND type = 'SPBE'),0);


