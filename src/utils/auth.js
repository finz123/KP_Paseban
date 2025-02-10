// utils/auth.js

// Fungsi untuk menjadwalkan auto-refresh token
export const scheduleTokenRefresh = (expiresIn) => {
    const refreshTime = (expiresIn - 10) * 10000;
  
    setTimeout(async () => {
      try {
        console.log('Refreshing access token...');
        await refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error.message);
        router.push('/login'); // Redirect jika gagal
      }
    }, refreshTime);
  };
      
  // Fungsi untuk memanggil endpoint /refresh
  export const refreshToken = async (retryCount = 0) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Kirim cookie
      });

      if (!response.ok) {
        if (retryCount < 3) {
          console.warn(`Retrying refresh token (${retryCount + 1}/3)...`);
          return refreshToken(retryCount + 1); // Ulangi permintaan
        }
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      console.log('Access token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing token:', error.message);
      throw error;
    }
  };
  