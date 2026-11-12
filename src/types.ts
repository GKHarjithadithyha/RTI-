export type Application = {
  id: string; type: 'RTI request' | 'First appeal'; authority: string; subject: string;
  date: string; updated: string; status: string; description: string; name: string;
  email: string; phone: string; address: string; timeline: { title: string; date: string; done: boolean }[];
};
export type Notice = { id: string; title: string; body: string; date: string; kind: string; unread: boolean; applicationId?: string };
