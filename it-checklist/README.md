# IT Standby Checklist 2026

Aplikasi checklist pengecekan perangkat IT yang harus standby 24 jam.

## Fitur
- ✅ Checkbox untuk setiap perangkat (29 item)
- 🕐 Timestamp otomatis saat item dicentang
- 📝 Kolom catatan per perangkat
- 🔍 Filter: Semua / Belum / Selesai + pencarian
- 💾 Data tersimpan otomatis di browser (reset tiap hari)
- 📱 Mobile-friendly

## Deploy ke Vercel (3 langkah)

### 1. Upload ke GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/it-checklist.git
git push -u origin main
```

### 2. Import ke Vercel
- Buka https://vercel.com/new
- Klik **"Import Git Repository"**
- Pilih repo `it-checklist`
- Klik **Deploy**

### 3. Selesai
Vercel otomatis mendeteksi Next.js. Tidak perlu konfigurasi tambahan.

## Jalankan lokal
```bash
npm install
npm run dev
```
Buka http://localhost:3000
