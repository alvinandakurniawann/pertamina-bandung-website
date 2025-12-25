# Company Profile Website

Website company profile dengan peta interaktif untuk menampilkan informasi organisasi dan lokasi outlet di berbagai wilayah.

## Tentang Proyek

Aplikasi web yang dibangun menggunakan Next.js untuk menampilkan informasi perusahaan, peta interaktif wilayah, dan sistem manajemen data outlet. Website ini dirancang responsif untuk desktop dan mobile.

## Fitur

- Halaman beranda dengan informasi organisasi
- Peta interaktif wilayah dan outlet menggunakan Mapbox
- Halaman informasi program khusus
- Sistem manajemen data dengan autentikasi
- Desain responsif untuk berbagai perangkat

## Teknologi

- Next.js 16 dengan TypeScript
- React 19
- Tailwind CSS 4
- Mapbox GL JS untuk peta interaktif
- Supabase untuk database dan autentikasi

## Persyaratan

- Node.js 18 atau lebih baru
- npm atau yarn
- Akun Mapbox untuk token API
- Akun Supabase untuk database

## Instalasi

Clone repository ini, lalu install dependencies:

```bash
npm install
```

## Konfigurasi

### Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Setup Mapbox

1. Buat akun di [Mapbox](https://account.mapbox.com/)
2. Buat access token baru dengan scope berikut:
   - STYLES:READ
   - STYLES:TILES
   - FONTS:READ
   - DATASETS:READ
3. Tambahkan token ke `.env.local` sebagai `NEXT_PUBLIC_MAPBOX_TOKEN`
4. Konfigurasi URL restrictions sesuai kebutuhan keamanan

### Setup Database

Jalankan file SQL migration di Supabase SQL Editor sesuai urutan yang ditentukan. File migration tersedia di root project.

## Menjalankan Aplikasi

Development server:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

Build untuk production:

```bash
npm run build
npm start
```

## Struktur Aplikasi

- Halaman publik untuk informasi umum
- Peta interaktif untuk visualisasi data
- Panel administrasi dengan sistem autentikasi
- Halaman login dan registrasi

## Autentikasi

Sistem autentikasi menggunakan Supabase Auth dengan konfigurasi domain whitelist sesuai kebutuhan organisasi.

## Development

### Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run start` - Menjalankan production server
- `npm run lint` - Menjalankan linter

## Lisensi

Materi, logo, dan merek dagang terkait adalah milik dan dilindungi oleh pemilik haknya masing-masing. Penggunaan materi pada situs ini mengikuti ketentuan yang berlaku.
