// middleware.js di root proyek
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Tambahkan header CORS
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); // Sesuaikan dengan asal Anda
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

// Tentukan jalur mana saja yang menggunakan middleware ini
export const config = {
  matcher: ['/api/:path*'], // Terapkan CORS untuk semua API route
};
