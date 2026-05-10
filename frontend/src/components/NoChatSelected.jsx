import { MessageCircle } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border border-gray-700 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-white text-lg font-semibold mb-1">Select a conversation</h3>
        <p className="text-gray-500 text-sm">Choose a contact from the sidebar to start chatting</p>
      </div>
    </div>
  );
};

export default NoChatSelected;
