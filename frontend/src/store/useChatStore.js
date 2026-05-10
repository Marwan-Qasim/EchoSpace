import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  contacts: [],
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isContactsLoading: false,
  isUsersLoading: false,
  isMessagesLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) =>
    set({ selectedUser }),

  getContacts: async () => {
    set({ isContactsLoading: true, isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/contacts");

      set({
        contacts: res.data,
        allContacts: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch contacts"
      );
    } finally {
      set({ isContactsLoading: false, isUsersLoading: false });
    }
  },

  getAllContacts: async () => get().getContacts(),

  getChatPartners: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/chats");

      set({
        chats: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch chats"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => get().getChatPartners(),

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set({
        messages: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => get().getMessages(userId),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // immediately update UI
    set({
      messages: [...messages, optimisticMessage],
    });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        messages: [...messages, res.data],
      });
    } catch (error) {
      // rollback optimistic update
      set({
        messages: messages,
      });

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId?.toString?.() === selectedUser._id.toString();

      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;

      set({
        messages: [...currentMessages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket?.off("newMessage");
  },
}));