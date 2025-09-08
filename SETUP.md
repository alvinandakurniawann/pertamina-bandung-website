# Setup Pertamina Bandung Website

## 🚀 Langkah Setup Lengkap

### 1. Setup Supabase Project

1. **Buat akun Supabase**
   - Kunjungi [supabase.com](https://supabase.com)
   - Sign up dengan GitHub atau email

2. **Buat project baru**
   - Klik "New Project"
   - Pilih organization
   - Isi nama project: `pertamina-bandung`
   - Pilih database password (simpan!)
   - Pilih region terdekat (Singapore)
   - Klik "Create new project"

3. **Dapatkan API Keys**
   - Buka project yang baru dibuat
   - Klik menu "Settings" → "API"
   - Copy **Project URL** dan **anon public** key

### 2. Setup Database

1. **Buka SQL Editor**
   - Di dashboard Supabase, klik "SQL Editor"
   - Klik "New query"

2. **Jalankan SQL Script**
   - Copy isi file `supabase-setup.sql`
   - Paste di SQL Editor
   - Klik "Run" untuk menjalankan

3. **Verifikasi Tables**
   - Klik menu "Table Editor"
   - Pastikan ada 3 tables: `regions`, `locations`, `changes`
   - Pastikan ada sample data

### 3. Setup Environment Variables

1. **Buat file `.env.local`**
   ```bash
   # Di root project
   cp env.example .env.local
   ```

2. **Edit `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   CRUD_SECRET=gasmelon3kg
   ```

### 4. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 5. Test Aplikasi

1. **Buka browser**: `http://localhost:3000`
2. **Test halaman utama**: Pastikan loading normal
3. **Test peta**: Klik `/peta-spbu-spbe`
4. **Test CRUD**: Klik `/crud` dan masukkan secret key

## 🔧 Troubleshooting

### Error: "Could not find table"
- Pastikan SQL script sudah dijalankan
- Cek di Table Editor apakah tables sudah ada

### Error: "Invalid API key"
- Pastikan URL dan key sudah benar
- Cek di Settings → API

### Error: "Network error"
- Pastikan internet connection
- Cek apakah Supabase project aktif

### Error: "CRUD access denied"
- Pastikan `CRUD_SECRET` sudah diset
- Masukkan secret key yang sama di form CRUD

## 📊 Database Schema

### Regions Table
```sql
- id: UUID (Primary Key)
- name: TEXT (Nama wilayah)
- color: TEXT (Warna untuk peta)
- spbu_count: INTEGER (Jumlah SPBU)
- spbe_count: INTEGER (Jumlah SPBE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Locations Table
```sql
- id: UUID (Primary Key)
- region_id: UUID (Foreign Key ke regions)
- name: TEXT (Nama lokasi)
- type: TEXT ('SPBU' atau 'SPBE')
- address: TEXT (Alamat)
- services: TEXT[] (Array layanan)
- hours: TEXT (Jam operasional)
- phone: TEXT (Nomor telepon)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Changes Table
```sql
- id: UUID (Primary Key)
- at: TIMESTAMP (Waktu perubahan)
- action: TEXT ('create', 'update', 'delete')
- entity: TEXT ('region', 'location')
- region_id: TEXT
- location_id: TEXT
- before: JSONB (Data sebelum)
- after: JSONB (Data sesudah)
- by: TEXT (User yang mengubah)
```

## 🎯 Next Steps

1. **Customize data**: Edit sample data sesuai kebutuhan
2. **Add more regions**: Tambah wilayah baru
3. **Deploy**: Deploy ke Vercel
4. **Domain**: Setup custom domain

## 📞 Support

Jika ada masalah:
1. Cek console browser untuk error
2. Cek Network tab untuk API calls
3. Cek Supabase logs di dashboard
4. Pastikan semua environment variables sudah benar
