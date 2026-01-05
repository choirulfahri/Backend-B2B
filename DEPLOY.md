# 🚀 Panduan Deploy Backend ke Vercel + Turso

## Prerequisites

✅ **Sudah Siap:**
- Backend code sudah di-push ke GitHub: `https://github.com/choirulfahri/Backend-B2B.git`
- Turso database sudah dibuat dan credentials tersimpan di `.env`
- Prisma Client sudah configured dengan `driverAdapters`

---

## 🔧 Langkah 1: Push Code Terbaru

Pastikan semua perubahan sudah di-commit dan push:

```bash
cd server
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## ☁️ Langkah 2: Setup Project di Vercel

### 2.1 Import Project

1. Buka [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository**
   - Pilih repository: `choirulfahri/Backend-B2B`
   - Klik **Import**

### 2.2 Configure Project Settings

#### Framework Preset
- Pilih: **Other** (bukan Next.js/Vite)

#### Root Directory
- **IMPORTANT**: Kosongkan (karena server ada di root repo)
- Atau set ke `.` jika diminta

#### Build Settings

Berdasarkan screenshot yang Anda berikan, isi seperti ini:

**Build Command:**
```
bun install && bunx prisma generate
```

**Output Directory:**
```
dist
```

**Install Command:**
```
bun install
```

> ⚠️ **PENTING**: Vercel mungkin belum support Bun secara default. Jika error, gunakan npm/pnpm sebagai alternatif:
> - Build Command: `npm install && npx prisma generate`
> - Install Command: `npm install`

---

## 🔐 Langkah 3: Environment Variables

Di section **Environment Variables**, tambahkan variabel berikut:

### Required Variables:

| Key | Value | Keterangan |
|-----|-------|------------|
| `DATABASE_URL` | `file:./dev.db` | Placeholder untuk Prisma (tidak dipakai di production) |
| `TURSO_DATABASE_URL` | `libsql://stin-db-efufu.aws-ap-northeast-1.turso.io` | URL Turso Anda |
| `TURSO_AUTH_TOKEN` | `eyJhbGci...` (token panjang) | Auth token dari Turso |
| `JWT_SECRET` | `supersecret_stin_dashboard_key` | Secret untuk JWT auth |

### Cara Input di Vercel:

1. Klik **Add More** untuk setiap variable
2. Masukkan **Key** dan **Value**
3. Environment: Pilih **Production**, **Preview**, dan **Development** (centang semua)

---

## 🚢 Langkah 4: Deploy!

1. Setelah semua setting selesai, klik **Deploy**
2. Tunggu proses build (sekitar 1-2 menit)
3. Jika sukses, Anda akan dapat URL deployment: `https://your-project.vercel.app`

---

## ⚠️ Troubleshooting

### Problem: Bun Not Found

**Solution**: Vercel default belum support Bun runtime. Gunakan Node/npm instead:

Update `vercel.json`:
```json
{
  "buildCommand": "npm install && npx prisma generate",
  "installCommand": "npm install"
}
```

### Problem: Prisma Client Not Found

**Solution**: Pastikan `prisma generate` sudah run di build command.

Cek di build logs apakah ada output:
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### Problem: Database Connection Failed

**Solution**: 
1. Pastikan `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` sudah benar
2. Cek apakah `db.ts` sudah menggunakan Turso adapter (bukan local file)

---

## ✅ Verification

Setelah deploy berhasil, test endpoint:

```bash
# Test health check
curl https://your-project.vercel.app

# Test API endpoint
curl https://your-project.vercel.app/api/dashboard/overview
```

---

## 📝 Next Steps

1. **Update Frontend**: Ganti `VITE_API_URL` di frontend dengan URL Vercel Anda
2. **Setup CORS**: Tambahkan domain frontend ke CORS config jika belum
3. **Monitor**: Gunakan Vercel dashboard untuk monitoring logs dan errors

---

## 📌 Quick Reference

**Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
**Turso Dashboard**: [turso.tech/app](https://turso.tech/app)
**Logs**: Klik project → Deployments → View Function Logs

**Re-deploy**: Push ke `main` branch = auto-deploy ✨
