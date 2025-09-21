1. Ringkasan proyek

Aplikasi ini menampilkan daftar todo yang dapat dibuat, diedit, dihapus, dan ditandai selesai/belum selesai. Setiap todo dapat diberi kategori. Fitur utama:

CRUD Todo

CRUD Kategori

Pencarian (search by title)

Pagination dasar (page & limit)

Responsive UI (desktop / tablet / mobile)

Backend RESTful dengan GORM dan PostgreSQL

2. Setup & cara jalankan (lokal)
Prasyarat

Go 1.20+ (atau versi stabil terbaru)

Node.js 16+ / npm atau yarn

PostgreSQL berjalan di lokal (atau container)

Optional: migrate tool untuk menjalankan migrations (atau jalankan SQL manual)

Environment / .env (backend)

Contoh .env (atau set env secara langsung):

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todoapp
DB_PORT=5432

Menjalankan backend (Go)

Masuk ke folder backend (atau root yang berisi main.go).

Install dependencies if needed (go mod tidy).

Pastikan database todoapp sudah dibuat:

CREATE DATABASE todoapp;


Jalankan:

go run main.go


Server akan berjalan di http://localhost:8080.

Catatan: Kode sudah memakai db.AutoMigrate(...) sehingga tabel otomatis dibuat jika belum ada.

Menjalankan frontend (React)

Masuk folder frontend (atau folder React).

Install:

npm install
# atau
yarn


Jalankan:

npm start
# atau
yarn start


Buka http://localhost:3000.

3. Struktur project (singkat)
backend/
  main.go
  database/
    connect.go
  controllers/
    todo_controller.go
    category_controller.go
  models/
    todo.go
    category.go
  routes/
    todo_routes.go
    category_routes.go

frontend/
  src/
    App.js
    context/
      TodoContext.js
    components/
      TodoForm.jsx
      TodoTable.jsx (atau di App.js)
    services/
      api.js (opsional)

4. API Documentation (ringkasan)

Base URL: http://localhost:8080/api

Todos

GET /api/todos
Query params: page (default 1), limit (default 10), search (opsional)
Response:

{
  "data": [ { "id":1, "title":"...", ... } ],
  "pagination": { "current_page":1, "per_page":10, "total":25, "total_pages":3 }
}


GET /api/todos/:id
Response: todo object atau 404

POST /api/todos
Body (JSON): { "title","description","category_id","priority","due_date" }
Response: created todo (201)

PUT /api/todos/:id
Body: fields yang sama, response: updated todo

DELETE /api/todos/:id
Response: { "message": "Deleted" }

PATCH /api/todos/:id/complete
Toggle completed boolean, response: updated todo

Categories

GET /api/categories → { "data": [ ... ] }

POST /api/categories → create

PUT /api/categories/:id → update

DELETE /api/categories/:id → delete

Semua response menggunakan JSON. Error returns contain {"error": "message"}.

5. Migrations (SQL example up/down)

Beri file migrations di migrations/:

001_create_categories.up.sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

001_create_categories.down.sql
DROP TABLE IF EXISTS categories;

002_create_todos.up.sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  priority VARCHAR(10) DEFAULT 'low',
  due_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_todos_title ON todos USING btree (title);
CREATE INDEX idx_todos_category ON todos USING btree (category_id);

002_create_todos.down.sql
DROP TABLE IF EXISTS todos;

Database Design
Tabel apa saja yang dibuat dan alasannya?

categories

Menyimpan daftar kategori (Work, Personal, dsb). Mempermudah pengelompokan todo dan filtering.

todos

Menyimpan item todo utama: judul, deskripsi, status completed, foreign key category_id, prioritas, due_date, created/updated timestamp.

Deskripsikan masing-masing tabel & tujuan

categories:

id (PK), name, color, created_at, updated_at.

Tujuan: menyimpan metadata kategori agar UI dapat menampilkan nama dan warna kategori.

todos:

id, title, description, completed (bool), category_id, priority (high|medium|low), due_date, created_at, updated_at.

Tujuan: menyimpan data tugas.

Relasi antar tabel

todos.category_id → foreign key ke categories.id.
Relasi: many todos → one category (Many-to-One).

Mengapa memilih struktur ini?

Sederhana & cukup untuk use-case challenge (2 tabel).

Normalisasi: kategori dipisah agar tidak duplikasi string kategori di tiap todo.

Memudahkan filter/aggregate per kategori.

Bagaimana menangani pagination & filtering di database?
Query yang digunakan untuk filtering & sorting

Filtering (search by title, case-insensitive) — PostgreSQL:

SELECT * FROM todos
WHERE title ILIKE '%' || :search || '%'
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;


Untuk filter by category / priority / completion:

WHERE category_id = :category_id
  AND priority = :priority
  AND completed = :completed

Bagaimana menangani pagination secara efisien

Gunakan LIMIT + OFFSET untuk pagination sederhana (cukup untuk dataset kecil/menengah).

Dapat dipertimbangkan keyset pagination (a.k.a. cursor-based) untuk skala besar: WHERE created_at < last_seen_created_at ORDER BY created_at DESC LIMIT N.

Pastikan COUNT(*) dilakukan pada query terpisah atau gunakan COUNT pada query yang sama (dibutuhkan untuk menampilkan total_pages).

Index apa yang ditambahkan dan alasannya

idx_todos_title — index b-tree pada kolom title mempercepat search prefix/suffix?

Catatan: b-tree biasa tidak membantu ILIKE '%keyword%' yang memulai wildcard. Untuk ILIKE 'keyword%' b-tree membantu.

Untuk pencarian substring (ILIKE '%keyword%'), gunakan PostgreSQL GIN index pada to_tsvector (full-text search) atau pg_trgm extension:

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_todos_title_trgm ON todos USING gin (title gin_trgm_ops);


idx_todos_category — cepatkan filter by category_id.

idx_todos_created_at — cepatkan ordering by created_at jika sering dipakai.

Technical Decisions
Bagaimana mengimplementasikan desain responsif?

Menggunakan Ant Design responsif utilities dan grid system (Row, Col) serta komponen Table, Drawer/Modal yang adaptif.

Gunakan CSS container with max-width dan padding responsive (media queries) bila perlu.

Breakpoints yang digunakan & alasannya

Ant Design standard breakpoints:

xs < 576px (mobile)

sm ≥ 576px (tablet kecil)

md ≥ 768px (tablet)

lg ≥ 992px (desktop)

xl ≥ 1200px (desktop besar)

Mengikuti Ant Design memudahkan karena komponen sudah disesuaikan.

Bagaimana UI beradaptasi di berbagai layar

Desktop: tampilkan tabel penuh, side filters, actions visible.

Tablet: tabel tetap, kolom berkurang atau disingkat (hide less penting).

Mobile: ubah ke kartu/list vertical, atau tabel dengan horizontal scroll; gunakan drawer/modal untuk form.

Komponen Ant Design yang membantu

Table — list & pagination

Input.Search — search bar

Modal / Drawer — form create/edit

Form, Select, DatePicker — input form

Row / Col — layout responsive

Tag / Badge — priority & category label

Bagaimana struktur komponen React?
Hierarki komponen (contoh)
App
 └─ TodoProvider (Context)
    └─ TodoPage
       ├─ Header (Search, Add button)
       ├─ TodoTable (Table, Actions)
       ├─ TodoForm (Modal / Drawer)
       └─ CategoryManager (opsional)

Bagaimana state dikelola antar komponen

Global state via React Context (TodoContext): todos, categories, loading, fungsi CRUD (fetchTodos, createTodo, updateTodo, deleteTodo, toggleComplete).

Lokal state di komponen untuk UI-only states: modal visibility, editingTodo, local search input before submit (debounced).

Bagaimana state filtering & pagination dikelola

fetchTodos(search, page, limit, filters) berada di Context; komponen UI (Header / Table) memanggil fetchTodos dengan parameter.

Pagination state (current page, per_page) bisa disimpan di Context atau lokal di TodoTable — jika banyak komponen perlu mengakses, simpan di Context.

Arsitektur backend yang dipilih & alasannya
Pilihan

Gin (web framework) + GORM (ORM) + PostgreSQL.

Struktur: models/, controllers/, routes/, database/.

Struktur API routes

routes/todo_routes.go untuk todos

routes/category_routes.go untuk categories

controllers/* dapat memuat logic lebih rinci bila route menjadi ringkas

Struktur kode (controllers, services, dll.)

models/ — struktur GORM models

database/connect.go — koneksi DB & AutoMigrate

controllers/ — handler fungsi (GetTodos, CreateTodo, dll.)

routes/ — menghubungkan route ke controller

(opsional) services/ — logika bisnis terpisah dari controllers jika app berkembang

Penanganan error

Gunakan c.JSON(statusCode, gin.H{"error": err.Error()}) untuk pesan error standar.

Validasi input return 400, not found return 404, server error return 500.

Logging kesalahan di server (log.Print / structured logs).

Bagaimana menangani validasi data?
Validasi di frontend, backend, atau keduanya?

Keduanya:

Frontend: validasi UI (required fields, format tanggal, panjang judul) menggunakan Ant Design Form rules untuk pengalaman user cepat.

Backend (wajib): validasi menyeluruh karena frontend bisa dimanipulasi. Validasi ini adalah lapisan keamanan dan integritas data.

Rules yang diterapkan

title — required, max length (mis. 255)

priority — enum high|medium|low

category_id — harus ada di table categories (atau null jika optional)

due_date — valid timestamp ISO

completed — boolean

Mengapa memilih pendekatan tersebut

UX: validasi di frontend meminimalkan request yang gagal.

Keamanan & integritas: server-side validation memastikan DB tidak terisi data invalid dari client yang dimanipulasi.

7. Testing & Quality
Apa yang diuji di unit test & alasannya

Prioritas untuk bonus:

Controller logic: memastikan endpoints mengembalikan status & payload yang tepat.

Service / business logic (jika dipisah): memastikan aturan toggle complete, validasi, dan transformasi data benar.

DB layer (model): create/read/update/delete basic flows (menggunakan test DB).

Fungsi/metode apa saja yang diuji

GetTodos dengan/ tanpa search & pagination

CreateTodo valid input & invalid input

ToggleTodoCompletion behavior

DeleteTodo non-existent id -> returns 404

Edge case yang diperhitungkan

Search dengan karakter khusus

Update pada todo yang tidak ada

Create dengan category_id yang tidak ada

Large pagination numbers (page > total pages)