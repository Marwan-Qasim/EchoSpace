import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Send, Image } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const success = await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    if (success) {
      setText("");
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-gray-800 bg-black p-4">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img src={imagePreview} alt="preview" className="max-h-32 rounded-lg" />
          <button
            onClick={() => {
              setImagePreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs hover:bg-gray-600"
          >
            ✕
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn btn-ghost btn-sm text-gray-400 hover:text-white"
        >
          <Image className="w-5 h-5" />
        </button>
        <input type="file" ref={fileRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="btn bg-white text-black hover:bg-gray-200 border-none"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
