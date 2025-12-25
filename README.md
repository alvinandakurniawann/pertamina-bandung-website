## Pertamina Bandung — Company Profile & Wilayah Outlet

Website company profile untuk Sales Area (SA) Retail Bandung yang menampilkan gambaran organisasi, bidang operasional utama, serta tautan ke peta overview wilayah dan outlet SPBU/SPBE di Bandung dan sekitarnya.

### Tujuan
- Menyediakan informasi ringkas tentang SA Retail Bandung kepada masyarakat dan pemangku kepentingan.
- Memudahkan akses ke peta overview wilayah dan outlet.

### Fitur Utama
- Beranda informatif dengan hero, tagline, dan ajakan bertindak “Lihat Peta Overview Wilayah dan Outlet”.
- Sejarah SA Retail Bandung dalam format timeline ringkas.
- Ikhtisar bidang operasional: Distribusi BBM Ritel, Penyaluran LPG, Jaringan Ritel & Pertashop, Digital & Subsidi Tepat, HSSE & Quality, Layanan Masyarakat & CSR.
- Tautan cepat ke halaman peta overview wilayah & outlet untuk eksplorasi lebih lanjut.
- Desain responsif dan modern, nyaman di perangkat mobile maupun desktop.

### Navigasi Halaman
- `/` — Beranda (hero, sejarah, operasional, CTA).
- `/index` — Peta Overview Wilayah dan Outlet.

### Audiens
- Masyarakat umum yang membutuhkan informasi lokasi dan layanan energi.
- Mitra dan pemangku kepentingan di wilayah Bandung.

### Teknologi
- Next.js (React) dengan TypeScript.
- Tailwind CSS untuk styling.
- Mapbox GL JS untuk peta interaktif.
- Komponen peta/overview pada halaman khusus.

### Setup Mapbox untuk Peta Interaktif

**⚠️ PENTING: Buat token sendiri untuk keamanan! Jangan gunakan token default.**

1. **Buat Mapbox Access Token:**
   - Login ke [Mapbox Account](https://account.mapbox.com/)
   - Buka menu **Tokens** → Klik **"Create a token"**
   - **Token Scopes** (Public):
     - ✅ STYLES:READ
     - ✅ STYLES:TILES
     - ✅ FONTS:READ
     - ✅ DATASETS:READ
   - **Token Restrictions** (Disarankan untuk keamanan):
     - Tambahkan URL aplikasi: `https://your-domain.com/*`
     - Untuk development: `http://localhost:3000/*`, `http://192.168.1.9:3000/*`
   - Klik **"Create token"** dan copy token (hanya muncul sekali!)

2. **Tambahkan ke Environment Variables:**
   ```bash
   # .env.local
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImN... (token Anda)
   ```
   
   **Catatan:** Token harus dimulai dengan `pk.` (public token)

3. **Lihat panduan lengkap:** Baca file `MAPBOX_SETUP.md` untuk detail lengkap

2. **Jalankan Migration Database:**
   - Buka Supabase SQL Editor
   - Jalankan file `supabase-migration-add-region-coordinates.sql`
   - Ini akan menambahkan field `latitude` dan `longitude` ke tabel `regions`
   - Data marker akan otomatis di-migrate dari hardcoded ke database

3. **Edit Koordinat Marker:**
   - Buka halaman `/crud/regions`
   - Edit region yang ingin diubah koordinatnya
   - Isi field Latitude dan Longitude
   - Simpan

**Catatan:**
- Mapbox gratis tier: 50,000 map loads/bulan
- Marker sekarang diambil dari database, bukan hardcoded
- Koordinat bisa di-edit via CRUD page

### Kepemilikan dan Merek
Materi, logo, dan merek dagang terkait Pertamina adalah milik dan dilindungi oleh pemilik haknya masing‑masing. Penggunaan materi pada situs ini mengikuti ketentuan internal yang berlaku.

### Status & Deploy
Proyek ini ditujukan sebagai situs company profile. Cocok untuk di‑deploy pada platform hosting modern.

### Kontak
Untuk pertanyaan lebih lanjut terkait konten situs ini, silakan hubungi tim SA Retail Bandung melalui kanal resmi.
