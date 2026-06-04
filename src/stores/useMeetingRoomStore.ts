import { create } from "zustand";

interface MeetingRoomStore {
  chatPanelOpen: boolean;
  participantsPanelOpen: boolean;
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  participantCount: number;
  unreadMessageCount: number;

  toggleChatPanel: () => void;
  toggleParticipantsPanel: () => void;
  setMicOn: (v: boolean) => void;
  setCamOn: (v: boolean) => void;
  setScreenSharing: (v: boolean) => void;
  setHandRaised: (v: boolean) => void;
  setParticipantCount: (n: number) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
  reset: () => void;
}

export const useMeetingRoomStore = create<MeetingRoomStore>((set) => ({
  chatPanelOpen: false,
  participantsPanelOpen: false,
  micOn: true,
  camOn: true,
  screenSharing: false,
  handRaised: false,
  participantCount: 0,
  unreadMessageCount: 0,

  toggleChatPanel: () =>
    set((s) => ({
      chatPanelOpen: !s.chatPanelOpen,
      participantsPanelOpen: false,
      unreadMessageCount: !s.chatPanelOpen ? 0 : s.unreadMessageCount,
    })),

  toggleParticipantsPanel: () =>
    set((s) => ({
      participantsPanelOpen: !s.participantsPanelOpen,
      chatPanelOpen: false,
    })),

  setMicOn: (v) => set({ micOn: v }),
  setCamOn: (v) => set({ camOn: v }),
  setScreenSharing: (v) => set({ screenSharing: v }),
  setHandRaised: (v) => set({ handRaised: v }),
  setParticipantCount: (n) => set({ participantCount: n }),
  incrementUnread: () =>
    set((s) => ({ unreadMessageCount: s.unreadMessageCount + 1 })),
  resetUnread: () => set({ unreadMessageCount: 0 }),
  reset: () =>
    set({
      chatPanelOpen: false,
      participantsPanelOpen: false,
      micOn: true,
      camOn: true,
      screenSharing: false,
      handRaised: false,
      participantCount: 0,
      unreadMessageCount: 0,
    }),
}));
