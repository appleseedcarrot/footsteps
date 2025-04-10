import { getAuthToken } from "./utils";

export const startPinging = () => {

  // grab token
  const loop = async () => {
    const token = await getAuthToken();
    
    if (!token) { return; }

    // update status online
    const url = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/ping`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('[PING] Response:', data);
    } catch (err) {
      console.error('[PING] Error:', err.message || err);
    }

    setTimeout(loop, 15000); // schedule the next ping only after this one is done
  };

  loop(); // start
};