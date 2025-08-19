-- Setup Database untuk Pertamina Bandung Website
-- Jalankan script ini di Supabase SQL Editor

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  spbu_count INTEGER DEFAULT 0,
  spbe_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('SPBU', 'SPBE')) NOT NULL,
  address TEXT NOT NULL,
  services TEXT[] DEFAULT '{}',
  hours TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create changes table for audit log
CREATE TABLE IF NOT EXISTS changes (
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

-- Enable Row Level Security
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE changes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for demo)
DROP POLICY IF EXISTS "Allow all on regions" ON regions;
CREATE POLICY "Allow all on regions" ON regions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on locations" ON locations;
CREATE POLICY "Allow all on locations" ON locations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on changes" ON changes;
CREATE POLICY "Allow all on changes" ON changes FOR ALL USING (true);

-- Insert sample data untuk testing
INSERT INTO regions (id, name, color, spbu_count, spbe_count) VALUES
  ('bojonagara', 'Bojonagara', '#90EE90', 3, 1),
  ('cibeunying', 'Cibeunying', '#32CD32', 4, 2),
  ('tegallega', 'Tegallega', '#FFB6C1', 2, 1),
  ('karees', 'Karees', '#87CEEB', 3, 1),
  ('ujung-berung', 'Ujung Berung', '#DDA0DD', 5, 2),
  ('gede-bage', 'Gede Bage', '#FFA500', 4, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample locations
INSERT INTO locations (region_id, name, type, address, services, hours, phone) VALUES
  ('bojonagara', 'SPBU Bojonagara 1', 'SPBU', 'Jl. Bojonagara No. 1', ARRAY['Pertalite', 'Pertamax'], '06:00-22:00', '022-1234567'),
  ('bojonagara', 'SPBU Bojonagara 2', 'SPBU', 'Jl. Bojonagara No. 2', ARRAY['Pertalite', 'Pertamax', 'Dexlite'], '06:00-22:00', '022-1234568'),
  ('bojonagara', 'SPBU Bojonagara 3', 'SPBU', 'Jl. Bojonagara No. 3', ARRAY['Pertalite'], '06:00-22:00', '022-1234569'),
  ('bojonagara', 'SPBE Bojonagara 1', 'SPBE', 'Jl. Bojonagara No. 4', ARRAY['LPG 3kg', 'LPG 12kg'], '06:00-22:00', '022-1234570'),
  
  ('cibeunying', 'SPBU Cibeunying 1', 'SPBU', 'Jl. Cibeunying No. 1', ARRAY['Pertalite', 'Pertamax'], '06:00-22:00', '022-1234571'),
  ('cibeunying', 'SPBU Cibeunying 2', 'SPBU', 'Jl. Cibeunying No. 2', ARRAY['Pertalite', 'Pertamax', 'Dexlite'], '06:00-22:00', '022-1234572'),
  ('cibeunying', 'SPBU Cibeunying 3', 'SPBU', 'Jl. Cibeunying No. 3', ARRAY['Pertalite'], '06:00-22:00', '022-1234573'),
  ('cibeunying', 'SPBU Cibeunying 4', 'SPBU', 'Jl. Cibeunying No. 4', ARRAY['Pertalite', 'Pertamax'], '06:00-22:00', '022-1234574'),
  ('cibeunying', 'SPBE Cibeunying 1', 'SPBE', 'Jl. Cibeunying No. 5', ARRAY['LPG 3kg', 'LPG 12kg'], '06:00-22:00', '022-1234575'),
  ('cibeunying', 'SPBE Cibeunying 2', 'SPBE', 'Jl. Cibeunying No. 6', ARRAY['LPG 3kg'], '06:00-22:00', '022-1234576')
ON CONFLICT DO NOTHING;

-- Update region counts
UPDATE regions SET 
  spbu_count = (SELECT COUNT(*) FROM locations WHERE region_id = regions.id AND type = 'SPBU'),
  spbe_count = (SELECT COUNT(*) FROM locations WHERE region_id = regions.id AND type = 'SPBE');
