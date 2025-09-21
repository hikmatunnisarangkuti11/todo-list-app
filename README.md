1. What database tables did you create and why?

Categories
Tabel ini menyimpan daftar kategori untuk todo, berisi kolom id, name, color, created_at, dan updated_at.
Tujuannya untuk mengelompokkan todo berdasarkan kategori sehingga pengguna bisa memilah todo dengan lebih mudah.

Todos
Menyimpan daftar tugas (todo) dengan kolom seperti id, title, description, category_id, priority, completed, created_at, dan updated_at.
Kolom category_id berfungsi sebagai foreign key ke tabel Categories.
Relasi: Many Todos belong to One Category.

Relasi antar tabel
Relasi utama adalah satu-ke-banyak (one-to-many) dari Categories ke Todos, karena satu kategori dapat memiliki banyak todo.

Kenapa memilih struktur ini?
Struktur ini sederhana namun fleksibel, memisahkan kategori dan todo agar data tetap terorganisir dan mudah diperluas. Relasi menggunakan foreign key agar integritas data terjaga.

2. How did you handle pagination and filtering in the database?

Queries untuk filtering dan sorting

Filtering berdasarkan keyword LIKE di kolom name (kategori) atau title dan description (todo).

Sorting menggunakan ORDER BY pada kolom tertentu (misal tanggal update, nama).

Pagination yang efisien

Menggunakan query dengan LIMIT dan OFFSET untuk mengambil data per halaman, contohnya:

SELECT * FROM todos WHERE title LIKE '%keyword%' ORDER BY created_at DESC LIMIT 10 OFFSET 20;


Pendekatan ini mencegah pengambilan data berlebih sehingga meningkatkan performa.

Index yang ditambahkan

Index pada kolom category_id di tabel Todos untuk mempercepat join dan filter kategori.

Index pada kolom name (kategori) dan title (todo) untuk mempercepat pencarian (LIKE).

Index ini meningkatkan performa query terutama saat dataset membesar.

Technical Decision Questions
1. How did you implement responsive design?

Breakpoint yang digunakan
Menggunakan breakpoint Ant Design md (768px) sebagai batas mobile vs desktop.

Adaptasi UI

Pada layar besar, sidebar Sider selalu tampil.

Pada mobile, sidebar berubah menjadi Drawer yang bisa dibuka-tutup dengan tombol menu.

Konten utama dan tabel mengikuti lebar layar dan menyesuaikan ukuran.

Komponen Ant Design yang membantu

Layout dengan Sider, Header, dan Content

Drawer untuk menu pada mobile

Grid.useBreakpoint untuk mendeteksi ukuran layar

2. How did you structure your React components?

Hierarki komponen

App sebagai root, mengatur layout dan navigasi.

TodoPage dan CategoryPage sebagai halaman utama, memuat tabel dan form terkait.

TodoTable dan CategoryTable untuk menampilkan data dengan fitur search, pagination, dan modal form.

DeleteConfirm untuk konfirmasi penghapusan data.

State management

Menggunakan Context API (TodoContext dan CategoryContext) untuk state global data (todos dan categories).

State lokal untuk modal, search, pagination, dan form kontrol.

Handling filtering dan pagination

State searchText dan currentPage disimpan di masing-masing tabel.

Data difilter dan dipaginasi secara lokal berdasarkan state ini sebelum di-render.

3. What backend architecture did you choose and why?

API route organization

Menggunakan REST API dengan endpoint /categories dan /todos.

Setiap resource memiliki controller sendiri (CategoryController, TodoController).

Struktur kode

Memisahkan controllers untuk business logic dan models untuk representasi data.

database package mengatur koneksi DB dan migrasi.

Error handling

Menggunakan status HTTP yang sesuai (400 untuk validation error, 404 untuk not found, 500 untuk server error).

Mengirim response error dalam format JSON dengan pesan deskriptif.

4. How did you handle data validation?

Validasi data

Dilakukan di backend dengan binding dan validasi struct (contoh: binding:"required" di Gin).

Validasi tambahan seperti unik nama kategori dicek dengan query sebelum create/update.

Di frontend juga ada validasi form menggunakan Ant Design Form rules agar user mendapat feedback langsung.

Rules validasi

Nama kategori wajib diisi dan tidak boleh duplikat.

Field lain seperti todo title wajib diisi.

Kenapa kedua sisi?

Frontend validation untuk user experience lebih baik.

Backend validation untuk keamanan dan menjaga integritas data.

Testing & Quality Questions
1. What did you choose to unit test and why?

Fokus testing pada fungsi CRUD backend dan validasi, memastikan data valid dan error ditangani dengan benar.

Fungsi-fungsi utilitas di frontend seperti filter dan pagination juga diuji agar UI konsisten.

Pertimbangan edge case seperti input kosong, duplikat, dan data tidak ditemukan.

2. If you had more time, what would you improve or add?

Technical debt

Menambahkan test coverage lebih lengkap, terutama integrasi API dan UI testing.

Refactor kode agar lebih modular dan scalable.

Fitur tambahan

Autentikasi user dan otorisasi.

Fitur drag-and-drop todo dan reorder kategori.

Integrasi notifikasi atau reminder.

Refactor

Pisahkan logic API ke layer service untuk pemisahan concern yang lebih baik.

Optimasi performa query dan caching.