import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";

const ChatArea = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    isMessagesLoading,
  } = useChatStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-black">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">
          {selectedUser?.profilePic ? (
            <img src={selectedUser.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            selectedUser?.fullName?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{selectedUser?.fullName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isMessagesLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg._id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatArea;
