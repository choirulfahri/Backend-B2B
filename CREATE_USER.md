# 👤 Panduan Menambahkan User

Setelah deploy ke Vercel + Turso, Anda perlu membuat user pertama untuk bisa login ke dashboard.

## 🔧 Cara 1: Script Create User (Lokal → Turso)

Script ini akan membuat user langsung ke database Turso dari komputer lokal Anda.

### 1. Pastikan credentials Turso tersimpan di `.env`

File `server/.env` harus berisi:
```env
TURSO_DATABASE_URL="libsql://stin-db-efufu.aws-ap-northeast-1.turso.io"
TURSO_AUTH_TOKEN="eyJhbGci..."
```

### 2. Jalankan script create-user

```bash
cd server
bun run src/create-user.ts "Admin Name" "admin@example.com" "password123"
```

**Output jika berhasil:**
```
Using Turso (LibSQL) Adapter
Creating user: Admin Name (admin@example.com)...
✅ User created successfully:
ID: 1
Name: Admin Name
Email: admin@example.com
```

### 3. Test login

Gunakan credentials tersebut untuk login ke dashboard.

---

## 🌐 Cara 2: API Endpoint (Jika ada endpoint register)

Jika backend Anda sudah punya endpoint `/api/auth/register`, Anda bisa create user via API:

```bash
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

---

## 📝 Cara 3: Manual via Turso CLI

Jika script tidak bisa jalan, Anda bisa insert manual via Turso CLI:

### 1. Connect ke database

```bash
turso db shell stin-db
```

### 2. Hash password terlebih dahulu

Gunakan tool online seperti [bcrypt-generator.com](https://bcrypt-generator.com/) untuk hash password Anda.

Atau jalankan script Node.js kecil:
```bash
node -e "require('bcrypt').hash('password123', 10, (e,h)=>console.log(h))"
```

### 3. Insert ke database

Di Turso shell, jalankan:
```sql
INSERT INTO User (email, password, name, createdAt, updatedAt) 
VALUES (
  'admin@example.com',
  '$2a$10$hashedpasswordhere...', 
  'Admin Name',
  datetime('now'),
  datetime('now')
);
```

### 4. Verifikasi

```sql
SELECT id, name, email FROM User;
```

---

## ✅ Verifikasi User Berhasil Dibuat

### Test di local:
```bash
cd server
bun run scripts/test-turso.ts
```

Cek output di bagian "Record counts" - seharusnya `Users: 1` (atau lebih).

### Test login via frontend:

1. Buka frontend Anda
2. Masuk ke halaman login
3. Gunakan email dan password yang sudah dibuat
4. Jika berhasil login → user creation sukses! ✅

---

## 🔐 Best Practices

1. **Jangan commit password ke Git** - Simpan password admin di password manager
2. **Ganti password default** - Setelah deploy pertama kali, ganti password via interface
3. **Buat user dengan role** - Jika ada sistem role (admin/user), tambahkan field `role` di schema

---

## 🐛 Troubleshooting

### Error: "User already exists"

User dengan email tersebut sudah ada. Gunakan email berbeda atau delete user lama:

```bash
turso db shell stin-db
# Di shell:
DELETE FROM User WHERE email = 'admin@example.com';
```

### Error: "Cannot connect to database"

Pastikan:
- `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` sudah benar di `.env`
- Database Turso masih aktif (cek di [turso.tech/app](https://turso.tech/app))

### Error: "bcryptjs module not found"

Script sudah diupdate pakai `Bun.password.hash` (native), tidak perlu `bcryptjs` lagi.
