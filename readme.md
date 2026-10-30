# 🖥️ NEXUS Custom PC & Gaming Gear
### ⚡ Full-Stack Business Web Application (STARTER Package - 10-Day Scope)

โปรเจกต์พัฒนาเว็บธุรกิจแบบ Full-stack ครบวงจร (Frontend + Backend + PostgreSQL Database) ตามมาตรฐานโจทย์ระดับองค์กร (STARTER Package) สำหรับนำเสนอข้อมูลธุรกิจ **ร้านจัดสเปกคอมพิวเตอร์ประกอบระดับพรีเมียม เวิร์กสเตชันสำหรับครีเอเตอร์ และเกมมิ่งเกียร์ (NEXUS Custom PC & Gaming Gear)** พร้อมระบบจัดการหลังบ้าน (Admin Portal) และระบบสมาชิก (User Portal) โดยไม่มีระบบชำระเงินหรือตะกร้าสินค้าตามข้อกำหนด

---

## 🎨 1. Business Brief (ข้อมูลแบรนด์และธุรกิจ)

| หัวข้อ | รายละเอียด |
| :--- | :--- |
| **ชื่อแบรนด์ (Brand Name)** | **NEXUS Custom PC & Gaming Gear** |
| **โลโก้ (Logo URL)** | `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80` |
| **สโลแกน (Tagline)** | *High-Performance Custom PC, Workstations & Gaming Peripherals* |
| **กลุ่มลูกค้าเป้าหมาย** | เกมเมอร์ (Gamers), สตรีมเมอร์ (Streamers), ครีเอเตอร์/กราฟิก/ตัดต่อวิดีโอ 8K (Content Creators), สถาปนิก 3D และโปรแกรมเมอร์ที่ต้องการคอมพิวเตอร์สเปกแรง คัสตอมเฉพาะบุคคล |
| **สีหลักประจำแบรนด์ (Tailwind Theme)** | • **Deep Tech Dark (`#0B0F19`)** - สื่อถึงความล้ำสมัย ดุดัน สไตล์ Cyberpunk<br>• **Electric Cyan (`#06B6D4`)** - สื่อถึงความเร็ว พลังงาน และไฟ RGB ระบายความร้อน<br>• **Vivid Indigo/Purple (`#6366F1`)** - สื่อถึงความไฮเอนด์และนวัตกรรมใหม่ |
| **หมวดหมู่สินค้า (4 หมวด)** | 1. Custom Gaming PC (คอมประกอบเล่นเกมระดับไฮเอนด์)<br>2. Workstation & Creator PC (คอมสตูดิโอสำหรับงานตัดต่อและเรนเดอร์ 3D)<br>3. Gaming Gear & Peripherals (จอภาพ 175Hz+, คีย์บอร์ด Custom, เมาส์ไร้สาย)<br>4. PC Hardware & Upgrades (GPU RTX 40 ซีรีส์, CPU, Gen5 SSD) |
| **จำนวนสินค้าเริ่มต้น** | 8 รายการ (พร้อม 3 เมนู/สเปกไฮไลต์สำหรับหน้าแรก) |

---

## 🛠️ 2. Tech Stack & Architecture

### **Frontend (`client/`)**
- **Core**: React 19 + TypeScript (Vite 8)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + High-Tech Dark Theme
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Plus Jakarta Sans* + *Prompt*)
- **Pages**:
  - หน้าแรก (`/`)
  - เกี่ยวกับเรา & สเปกคอมพิวเตอร์ทั้งหมด (`/about`)
  - ติดต่อขอใบเสนอราคาจัดสเปกคอม (`/contact`)
  - หน้าเข้าสู่ระบบสมาชิก/ลูกค้า (`/login`)
  - หน้าเข้าสู่ระบบแอดมินหลังบ้าน (`/admin/login`)
  - หน้าจัดการหลังบ้าน 5 โมดูล (`/admin`, `/admin/settings`, `/admin/pages`, `/admin/services`, `/admin/messages`)

### **Backend (`server/`)**
- **Runtime**: Bun 1.4+
- **Framework**: Hono Framework
- **ORM**: Drizzle ORM + drizzle-kit
- **Database**: PostgreSQL (port 5432, Database: `starter_biz`)
- **Validation**: Zod (แชร์ Types และ Schemas ร่วมกัน)
- **Authentication**: JWT Cookie (`httpOnly`, `SameSite: Lax`, Session อายุ 1 วัน) + Password Hashing ด้วย `Bun.password` (Bcrypt)

---

## 🚀 3. วิธีการรันระบบ (How to Run)

### **ขั้นตอนที่ 1: รัน Backend Server (พอร์ต 5000)**
```bash
cd server
bun install
bun run dev
```

### **ขั้นตอนที่ 2: รัน Frontend Client (พอร์ต 5173)**
เปิด Terminal ใหม่อีกหน้าต่าง:
```bash
cd client
bun install
bun run dev
```

เปิดเว็บเบราว์เซอร์ไปที่: **`http://localhost:5173`**

---

## 🔐 4. ข้อมูลการเข้าสู่ระบบ (Unified Login Credentials)

ระบบเข้าสู่ระบบถูกออกแบบให้เป็น **ศูนย์กลางเดียวกัน (Unified Portal)** สามารถเข้าถึงได้ทั้งจาก `/login` และ `/admin/login`:
- มีแท็บสลับด้านบนระหว่าง **🛡️ ผู้ดูแลระบบ (Admin)** และ **👤 สมาชิก/ลูกค้า (User)**
- **กรอกรหัสแอดมินเองได้อิสระ**: มีปุ่มรูปตา 👁️ (`Eye` / `EyeOff`) ให้เปิด/ปิดดูรหัสผ่านที่พิมพ์ได้ทันที
- มีปุ่มทางลัด **"⚡ เติมอัตโนมัติ"** สำหรับการทดสอบที่รวดเร็ว
- สามารถเปลี่ยนรหัสผ่านแอดมินเองได้ในหน้า **ตั้งค่าเว็บไซต์ (`/admin/settings`)**

### **A. บัญชีผู้ดูแลระบบ (Admin)**
- **URL**: `http://localhost:5173/admin/login` หรือ `http://localhost:5173/login?role=admin`
- **Email**: `admin@nexuspc.co.th`
- **Password**: `admin123456` *(หรือรหัสผ่านใหม่ที่ท่านตั้งในหน้าตั้งค่า)*
- **กฎความปลอดภัย**: หากกรอกผิด แสดงข้อความ generic ว่า *"อีเมลหรือรหัสผ่านไม่ถูกต้อง"* โดยไม่ระบุช่อง

### **B. บัญชีสมาชิกทั่วไป (Customer / Member)**
- **URL**: `http://localhost:5173/login`
- **Demo User**: `customer@nexuspc.co.th` / `nexus123456`
- **ฟังก์ชัน**: เข้าสู่ระบบ / สมัครสมาชิกใหม่, จดจำการเข้าสู่ระบบ, ปุ่ม Auto-fill บัญชีทดสอบ

