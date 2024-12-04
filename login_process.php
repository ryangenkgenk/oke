<?php
session_start(); // Memulai session
include 'config.php'; // Pastikan koneksi ke database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Mencari user di database
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = mysqli_prepare($config, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);

    // Memverifikasi password
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id']; // Menyimpan ID pengguna di session
        header("Location: index.html"); // Arahkan ke halaman daftar siswa
        exit;
    } else {
        echo "Username atau password salah.";
    }

    mysqli_close($config); // Menutup koneksi
} else {
    echo "Metode tidak valid.";
}
?>