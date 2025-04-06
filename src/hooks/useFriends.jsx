import { useEffect, useState } from 'react';

export const useFriends = (user) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;

      const token = await new Promise((resolve) =>
        chrome.storage.local.get('authToken', (result) => resolve(result.authToken))
      );

      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFriends(data || []);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  return { friends, loading };
};