import { useAuthStore } from "../store/useAuthStore.js";

const MessageBubble = ({ message }) => {
  const { authUser } = useAuthStore();
  const isMine = message.senderId === authUser._id;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isMine
            ? "bg-white text-black rounded-br-md"
            : "bg-gray-800 text-white rounded-bl-md"
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="attachment"
            className="max-w-full rounded-lg mb-1"
          />
        )}
        {message.text && <p className="text-sm">{message.text}</p>}
        <p className={`text-[10px] mt-1 ${isMine ? "text-gray-500" : "text-gray-400"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
