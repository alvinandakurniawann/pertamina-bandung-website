# Pertamina Bandung Website

Website untuk menampilkan peta SPBU dan SPBE wilayah Bandung.

## Setup Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Copy URL dan Anon Key dari Settings > API
4. Buat file `.env.local` dengan isi:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CRUD_SECRET=your_crud_secret_key
```

### 3. Setup Database Tables
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Create regions table
CREATE TABLE regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  spbu_count INTEGER DEFAULT 0,
  spbe_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE locations (
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

-- Enable Row Level Security
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE changes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for demo)
CREATE POLICY "Allow all on regions" ON regions FOR ALL USING (true);
CREATE POLICY "Allow all on locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all on changes" ON changes FOR ALL USING (true);
```

### 4. Setup Storage (Opsional)
Jika ingin menyimpan gambar peta di database:
1. Buka Storage di Supabase Dashboard
2. Buat bucket baru bernama `maps`
3. Upload file `map.svg` ke bucket tersebut

### 5. Run Development Server
```bash
npm run dev
```

## Deployment

### Vercel (Rekomendasi)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel
4. Deploy otomatis

## Fitur

- 🗺️ Peta interaktif SPBU & SPBE
- 📊 Dashboard CRUD data
- 🔄 Realtime updates dengan Supabase
- 📱 Responsive design
- 🎨 Modern UI dengan Tailwind CSS

## Struktur Data

### Regions
- `id`: UUID
- `name`: Nama wilayah
- `color`: Warna untuk peta
- `spbu_count`: Jumlah SPBU
- `spbe_count`: Jumlah SPBE

### Locations
- `id`: UUID
- `region_id`: Foreign key ke regions
- `name`: Nama lokasi
- `type`: 'SPBU' atau 'SPBE'
- `address`: Alamat lengkap
- `services`: Array layanan
- `hours`: Jam operasional
- `phone`: Nomor telepon

## Teknologi

- **Next.js 15** - React framework
- **Supabase** - Database & Realtime
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PostgreSQL** - Database engine
