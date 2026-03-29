import { api } from './config';

export const logEvent = async (session_id: number, event_type: string, metadata?: any) => {
  const res = await api.post('/behavior/event', {
    session_id,
    event_type,
    metadata
  });
  return res.data;
};
