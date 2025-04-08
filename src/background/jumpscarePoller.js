import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_APP_SUPABASE_URL, import.meta.env.VITE_APP_SUPABASE_ANON_KEY);

export const startRealTimeJumpscareListener = (userId) => {
    supabase.channel('custom-insert-channel')
      .on('postgres_changes',
        {
          event: 'INSERT', schema: 'public', table: 'jumpscares' },
          (payload) => {
            const scare = payload.new;
            if (scare.recipient_id === userId) {
              console.log('Jumpscare Received')
            }
          }
      )
      .subscribe()
}