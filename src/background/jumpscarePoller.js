import { receiveJumpscare } from '../utils/receiveJumpscare';
import { supabase } from '../utils/supabaseClient';

export const startRealTimeJumpscareListener = (userId, blockedSites) => {
    supabase.channel('custom-insert-channel')
      .on('postgres_changes',
        {
          event: 'INSERT', schema: 'public', table: 'jumpscares' },
          (payload) => {
            const scare = payload.new;
            if (scare.recipient_id === userId) {
              receiveJumpscare(userId, blockedSites, payload, supabase);
            }
          }
      )
      .subscribe()
}