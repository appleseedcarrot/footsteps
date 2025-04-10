export async function sendJumpscare(friendId) {
    console.log(friendId);
    const token = await new Promise((resolve) =>
      chrome.storage.local.get('authToken', (res) => resolve(res.authToken))
    );
  
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/jumpscare/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipientId: friendId }),
    });
  
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to send jumpscare');
    console.log("data from jumpscare send:", data);
    return data;
}