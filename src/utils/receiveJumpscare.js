import { getAuthToken } from "../background/utils";

// TODO:
// - Random chance that it will still jumpscare you even if you get out of the tab in time.
// - Random amount of time before jumpscare appears - you won't know you escaped or not until 2 to 3 seconds after

export async function receiveJumpscare(userId, blockedSites, payload, supabase) {
    const scare = payload.new;

    if (scare.recipient_id !== userId) return;

    try {
      const token = await getAuthToken(); // however you're retrieving it

      await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/ping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('[PING] Error:', err.message || err);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.url) return;

        // Always send footsteps first
        chrome.tabs.sendMessage(tab.id, { action: 'playSound' });

        setTimeout(async () => {
          // After 5s delay, check again
          chrome.tabs.query({ active: true, currentWindow: true }, async (checkTabs) => {
            const currentTab = checkTabs[0];

            const isBlocked = blockedSites.some((site) => currentTab?.url?.includes(site));
            
            console.log(scare.id);

            if (isBlocked) {
              // Show jumpscare
              chrome.tabs.sendMessage(currentTab.id, { action: 'JUMPSCARE' });

              // Update DB: they got caught
              await supabase
                .from('jumpscares')
                .update({ result: 'caught' })
                .eq('id', scare.id)
                .single();

              if (error) console.error("Failed to update jumpscare result");
            } else {
              // Update DB: they escaped
              await supabase
                .from('jumpscares')
                .update({ result: 'escaped' })
                .eq('id', scare.id)
                .single();

              if (error) console.error("failed to update jumpscare result");
            }
          });
        }, 5000);
      })
} 