Ringkasan Proyek Aplikasi Todo

Aplikasi Todo berbasis web yang memungkinkan pengguna untuk membuat, mengedit, menghapus, dan menandai tugas sebagai selesai/belum selesai. Setiap tugas dapat diberi kategori. Fitur utama:

CRUD Todo (Create, Read, Update, Delete)

CRUD Kategori

Pencarian berdasarkan judul

Pagination dasar

Responsive UI (desktop, tablet, mobile)

Backend RESTful dengan GORM dan PostgreSQL

Prasyarat

Go 1.20+ (atau versi terbaru)

Node.js 16+ / npm/yarn

PostgreSQL (lokal atau container)

Setup Lokal

Backend (Go):

Install dependensi: go mod tidy

Pastikan database todoapp ada: CREATE DATABASE todoapp;

Jalankan server: go run main.go

Akses API di: http://localhost:8080

Frontend (React):

Install dependensi: npm install atau yarn

Jalankan frontend: npm start atau yarn start

Akses UI di: http://localhost:3000

Struktur Proyek
Backend

main.go: Entry point aplikasi

database/: Koneksi dan migrasi DB

controllers/: Logika CRUD

models/: Struktur data

routes/: Definisi rute API

Frontend

App.js: Entry point React

context/: Global state untuk Todos

components/: UI components (form, tabel, dll)

services/: API requests

API Endpoints
Todos

GET /api/todos: Mengambil daftar todo dengan parameter pencarian, pagination.

GET /api/todos/:id: Mengambil todo berdasarkan ID.

POST /api/todos: Menambahkan todo baru.

PUT /api/todos/:id: Memperbarui todo.

DELETE /api/todos/:id: Menghapus todo.

PATCH /api/todos/:id/complete: Menandai todo sebagai selesai/belum selesai.

Categories

GET /api/categories: Mengambil daftar kategori.

POST /api/categories: Menambah kategori.

PUT /api/categories/:id: Memperbarui kategori.

DELETE /api/categories/:id: Menghapus kategori.

Struktur Database

categories: Menyimpan kategori todo (e.g., Work, Personal).

todos: Menyimpan data tugas (judul, deskripsi, status, kategori, prioritas, due date).

Relasi: todos.category_id → categories.id (Many-to-One).

Desain Responsif

Mobile: Menampilkan daftar todo dalam format kartu, navigasi di drawer/modal.

Tablet: Kolom disingkat, masih menampilkan tabel.

Desktop: Tabel penuh dengan filter samping.

Menggunakan Ant Design untuk responsif grid dan komponen adaptif.

Pengelolaan State

Global State: Menggunakan React Context untuk state global (todos, categories, filter, pagination).

Local State: Digunakan di komponen untuk UI-only states seperti visibilitas modal dan input pencarian.

Arsitektur Backend

Gin: Web framework untuk Go

GORM: ORM untuk PostgreSQL

PostgreSQL: Database untuk menyimpan data todo dan kategori.

Validasi Data

Frontend: Validasi untuk UX (mis. panjang judul, format tanggal).

Backend: Validasi lebih mendalam untuk keamanan (mis. cek kategori_id, prioritas, tanggal).

Testing & Quality

Unit Tests:

Pengujian CRUD: Get, Create, Update, Delete untuk todos.

Validasi error handling: 404 untuk id tidak ditemukan, 400 untuk input invalid.

Pagination & search behavior.

Edge Case:

Pencarian dengan karakter khusus.

Pagination dengan page yang melebihi total halaman.

Keputusan Teknis

Database Indexing: Menambahkan index pada kolom title, category_id, dan created_at untuk meningkatkan performa query.

Pagination: Menggunakan LIMIT + OFFSET untuk pagination dasar, dengan opsi untuk keyset pagination di masa depan.

Kesimpulan

Proyek ini mencakup pengelolaan tugas dengan fitur CRUD yang lengkap, pencarian, dan pengelompokan berdasarkan kategori. Menggunakan teknologi modern seperti Go, React, dan PostgreSQL untuk membangun aplikasi yang dapat berfungsi di berbagai perangkat dengan desain responsif dan arsitektur yang skalabel.