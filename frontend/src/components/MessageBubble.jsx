import { useAuthStore } from "../store/useAuthStore.js";
import { useState } from "react";

const MessageBubble = ({ message }) => {
  const { authUser } = useAuthStore();
  const isMine = message.senderId === authUser._id;
  const hasImage = Boolean(message.image);
  const hasText = Boolean(message.text);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div className="max-w-[70%]">
        {hasImage && (
          <>
            <button type="button" onClick={() => setIsImageOpen(true)} className="block">
              <img
                src={message.image}
                alt="attachment"
                className="w-auto max-w-[220px] max-h-[260px] object-cover rounded-lg cursor-zoom-in"
              />
            </button>

            {isImageOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
                onClick={() => setIsImageOpen(false)}
              >
                <img
                  src={message.image}
                  alt="enlarged attachment"
                  className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg"
                />
              </div>
            )}
          </>
        )}
        {hasText && (
          <div
            className={`px-4 py-2 rounded-2xl mt-1 ${
              isMine
                ? "bg-white text-black rounded-br-md"
                : "bg-gray-800 text-white rounded-bl-md"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        )}
        <p className={`text-[10px] mt-1 text-right pr-1 ${isMine ? "text-gray-500" : "text-gray-400"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
