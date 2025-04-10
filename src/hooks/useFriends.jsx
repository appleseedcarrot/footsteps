import { useEffect, useState } from 'react';

export const useFriends = (user, refreshCount) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);

      if (!user) {
        return;
      }

      const token = await new Promise((resolve) =>
        chrome.storage.local.get('authToken', (result) => resolve(result.authToken))
      );

      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rawData = await res.json();

        if (!Array.isArray(rawData)) {
          console.warn('[useFriends] Invalid data:', rawData);
          setFriends([]);
          return;
        }

        // Parse friend data: determine which user is the actual friend
        const parsed = rawData.map((entry) => {
          const isSender = entry.user_id === user.id;
          const otherUser = isSender ? entry.recipient : entry.requester;
          const friendId = isSender ? entry.friend_id : entry.user_id;
          
          return {
            id: entry.id,
            status: entry.status,
            user: otherUser,
            friendId: friendId,
            isSender,
          };
        });

        setFriends(parsed);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user, refreshCount]);

  return { friends, loading };
};