import { getAuthToken } from "./utils";
import { UserContext } from "../contexts/userContext";
import { useContext } from "react";

export const startPinging = () => {
  const { user } = useContext(UserContext);

  if (!user) return;

  // grab token
  const loop = async () => {
    const token = await getAuthToken();

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