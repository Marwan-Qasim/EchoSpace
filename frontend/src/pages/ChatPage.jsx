import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatArea from "../components/ChatArea.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";

const ChatPage = () => {
  const { authUser, socket } = useAuthStore();
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { connectSocket, disconnectSocket } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!authUser || !socket) return;

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [authUser, socket, subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="h-screen bg-black flex">
      <Sidebar />
      {selectedUser ? <ChatArea /> : <NoChatSelected />}
    </div>
  );
};

export default ChatPage;
