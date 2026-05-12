import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  contacts: [],
  allContacts: [],
  chats: [],
  messages: [],
  unreadCounts: {},
  activeTab: "chats",
  selectedUser: null,
  isContactsLoading: false,
  isUsersLoading: false,
  isMessagesLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) =>
    set((state) => {
      if (!selectedUser?._id) return { selectedUser };
      return {
        selectedUser,
        unreadCounts: {
          ...state.unreadCounts,
          [selectedUser._id]: 0,
        },
      };
    }),

  getContacts: async () => {
    set({ isContactsLoading: true, isUsersLoading: true });

    try {
      const [contactsRes, chatsRes] = await Promise.all([
        axiosInstance.get("/messages/contacts"),
        axiosInstance.get("/messages/chats"),
      ]);
      set({
        contacts: contactsRes.data,
        allContacts: contactsRes.data,
        chats: chatsRes.data,
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
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) return false;

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

    // immediately update UI with optimistic message
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    // move this user to chats instantly if this is first message
    const currentChats = get().chats;
    const alreadyInChats = currentChats.some(
      (chatUser) => chatUser._id?.toString?.() === selectedUser._id?.toString?.()
    );
    if (!alreadyInChats) {
      set({
        chats: [selectedUser, ...currentChats],
      });
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data : msg
        ),
      }));

      return true;
    } catch (error) {
      // rollback optimistic message
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
        chats: alreadyInChats
          ? state.chats
          : state.chats.filter(
              (chatUser) =>
                chatUser._id?.toString?.() !== selectedUser._id?.toString?.()
            ),
      }));

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );

      return false;
    }
  },

  deleteConversation: async (userId) => {
    const { selectedUser, chats } = get();

    try {
      await axiosInstance.delete(`/messages/conversation/${userId}`);

      const updatedChats = chats.filter((chatUser) => chatUser._id !== userId);
      const shouldClearSelectedUser = selectedUser?._id === userId;

      set({
        chats: updatedChats,
        selectedUser: shouldClearSelectedUser ? null : selectedUser,
        messages: shouldClearSelectedUser ? [] : get().messages,
        unreadCounts: {
          ...get().unreadCounts,
          [userId]: 0,
        },
      });

      toast.success("Chat deleted");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete chat");
      return false;
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.warn("⚠️ Socket not available for subscribing to messages");
      return;
    }

    console.log("📡 Subscribing to newMessage events...");

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      console.log("📨 New message received:", newMessage);
      const { selectedUser, chats, allContacts, unreadCounts } = get();
      const { authUser } = useAuthStore.getState();
      const isIncoming = newMessage.receiverId?.toString?.() === authUser?._id?.toString?.();

      if (isIncoming) {
        const senderId = newMessage.senderId?.toString?.();
        const alreadyInChats = chats.some(
          (chatUser) => chatUser._id?.toString?.() === senderId
        );
        if (!alreadyInChats) {
          const senderContact = allContacts.find((contact) => contact._id === senderId);
          if (senderContact) {
            set({ chats: [senderContact, ...chats] });
          }
        }

        const isSelectedSender = selectedUser?._id?.toString?.() === senderId;
        if (!isSelectedSender && senderId) {
          set({
            unreadCounts: {
              ...unreadCounts,
              [senderId]: (unreadCounts[senderId] || 0) + 1,
            },
          });
        }
      }

      if (!selectedUser?._id) return;

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