# Pertamina Cabang Bandung Website

Website statis untuk Pertamina Cabang Bandung yang menampilkan informasi perusahaan, layanan, dan lokasi SPBU/SPBE dengan peta interaktif Sales Area (SA) Bandung.

## 🌟 Fitur Utama

- **Beranda**: Halaman utama dengan informasi overview perusahaan
- **Tentang Kami**: Sejarah, visi misi, dan nilai-nilai perusahaan
- **Layanan**: Detail produk dan layanan yang ditawarkan
- **Peta SA**: Peta interaktif Sales Area Bandung dengan lokasi SPBU/SPBE
- **Kontak**: Informasi kontak dan form inquiry
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **SEO Optimized**: Meta tags dan struktur yang SEO-friendly

## 🗺️ Fitur Peta SA Interaktif

### Cara Menggunakan Peta SA
1. **Klik Area Wilayah**: User dapat mengklik pada 6 wilayah SA Bandung:
   - **Bojonagara** (Hijau Muda)
   - **Cibeunying** (Hijau Lime)
   - **Tegallega** (Oranye Muda)
   - **Karees** (Biru Muda)
   - **Ujung Berung** (Ungu Muda)
   - **Gede Bage** (Oranye)

2. **Detail Wilayah**: Setiap klik akan menampilkan:
   - Statistik SPBU dan SPBE di wilayah tersebut
   - Daftar lengkap lokasi dengan informasi detail
   - Modal popup dengan data lengkap

3. **Detail Lokasi**: User dapat mengklik lokasi individual untuk melihat:
   - Nama dan tipe lokasi (SPBU/SPBE)
   - Alamat lengkap
   - Jam operasional
   - Nomor telepon
   - Layanan yang tersedia

### Teknologi Peta
- **SVG Interactive**: Menggunakan SVG untuk peta yang ringan dan responsif
- **Clickable Regions**: Area wilayah yang dapat diklik dengan hover effects
- **Modal System**: Popup detail yang user-friendly
- **Color Coding**: Warna berbeda untuk setiap wilayah dan tipe lokasi

## 📱 Halaman yang Tersedia

### 1. Beranda (`/`)
- Hero section dengan branding Pertamina
- Fitur-fitur unggulan
- Preview layanan dan tentang kami
- Call-to-action untuk kontak

### 2. Tentang Kami (`/tentang`)
- Sejarah Pertamina
- Visi dan Misi
- Nilai-nilai perusahaan
- Timeline perkembangan
- Struktur manajemen

### 3. Layanan (`/layanan`)
- **BBM**: Pertalite, Pertamax, Pertamax Turbo, Dexlite
- **LPG**: 3kg dan 12kg
- **Pertashop**: Toko retail
- **Pertamina Pay**: Layanan pembayaran digital

### 4. Peta SA (`/peta-sa`) ⭐ **BARU**
- Peta interaktif 6 wilayah SA Bandung
- Data lengkap SPBU dan SPBE
- Modal detail untuk setiap lokasi
- Statistik per wilayah
- Legend dan navigasi yang mudah

### 5. Kontak (`/kontak`)
- Informasi kontak lengkap
- Jam operasional
- Form inquiry
- FAQ
- Lokasi kantor

## 🛠️ Teknologi yang Digunakan

- **Next.js 14**: Framework React dengan App Router
- **TypeScript**: Type safety dan developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management (useState)
- **SVG**: Peta interaktif yang ringan
- **Responsive Design**: Mobile-first approach

## 🚀 Instalasi dan Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd pertamina-bandung-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan development server**
```bash
npm run dev
```

4. **Buka browser**
```
http://localhost:3000
```

### Scripts yang Tersedia

```bash
npm run dev          # Development server
npm run build        # Build untuk production
npm run start        # Production server
npm run lint         # ESLint checking
```

## 📁 Struktur Proyek

```
pertamina-bandung-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Beranda
│   │   ├── tentang/
│   │   │   └── page.tsx          # Tentang Kami
│   │   ├── layanan/
│   │   │   └── page.tsx          # Layanan
│   │   ├── peta-sa/
│   │   │   └── page.tsx          # Peta SA Interaktif ⭐
│   │   ├── kontak/
│   │   │   └── page.tsx          # Kontak
│   │   ├── layout.tsx            # Layout utama
│   │   └── globals.css           # Global styles
│   └── components/               # Komponen reusable
├── public/                       # Static assets
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Kustomisasi

### Mengubah Konten
- **Data Peta**: Edit `saRegions` array di `src/app/peta-sa/page.tsx`
- **Informasi Perusahaan**: Update konten di halaman masing-masing
- **Metadata**: Ubah di `src/app/layout.tsx`

### Mengubah Styling
- **Warna**: Customize di `tailwind.config.js`
- **Font**: Ganti font di `layout.tsx`
- **Layout**: Modifikasi komponen di setiap halaman

### Menambah Lokasi Baru
1. Edit array `saRegions` di `peta-sa/page.tsx`
2. Tambahkan data lokasi baru
3. Update koordinat SVG jika diperlukan

## 📊 Data Peta SA

### Wilayah yang Tersedia
- **Bojonagara**: 3 SPBU, 1 SPBE
- **Cibeunying**: 4 SPBU, 2 SPBE  
- **Tegallega**: 2 SPBU, 1 SPBE
- **Karees**: 3 SPBU, 1 SPBE
- **Ujung Berung**: 5 SPBU, 2 SPBE
- **Gede Bage**: 4 SPBU, 2 SPBE

### Informasi Lokasi
Setiap lokasi mencakup:
- Nama dan tipe (SPBU/SPBE)
- Alamat lengkap
- Jam operasional
- Nomor telepon
- Layanan yang tersedia

## 🌐 Deployment

### Vercel (Recommended)
1. Push ke GitHub
2. Connect repository di Vercel
3. Deploy otomatis

### Netlify
1. Build project: `npm run build`
2. Upload folder `.next` ke Netlify
3. Configure build settings

### Manual Deployment
1. Build: `npm run build`
2. Export: `npm run export`
3. Upload ke hosting provider

## 🔧 Konfigurasi

### Environment Variables
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Tailwind CSS
Konfigurasi custom di `tailwind.config.js`:
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pertamina-blue': '#1e40af',
        'pertamina-yellow': '#f59e0b',
      }
    }
  }
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Fitur Responsive
- Navigation menu yang collapse di mobile
- Peta yang scalable di semua device
- Modal yang responsive
- Grid layout yang adaptif

## 🎯 SEO & Performance

### SEO Features
- Meta tags yang lengkap
- Structured data
- Sitemap generation
- Open Graph tags
- Twitter Cards

### Performance
- Static generation (SSG)
- Image optimization
- Code splitting
- Lazy loading
- Minimal bundle size

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: info@pertamina-bandung.com
- Phone: 022-1234567
- Website: https://pertamina-bandung.com

## 📄 License

© 2024 Pertamina Cabang Bandung. All rights reserved.

---

**Note**: Website ini dibuat untuk keperluan internal Pertamina Cabang Bandung. Semua data dan informasi bersifat contoh dan dapat disesuaikan dengan kebutuhan aktual.
