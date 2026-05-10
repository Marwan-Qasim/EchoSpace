import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, Search, MessageCircle, Trash2, Settings, X } from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const {
    contacts,
    chats,
    getContacts,
    isContactsLoading,
    selectedUser,
    setSelectedUser,
    deleteConversation,
    unreadCounts,
    activeTab,
    setActiveTab,
  } = useChatStore();
  const { authUser, logout, onlineUsers, updateProfile, isUpdatingProfile } = useAuthStore();
  const [search, setSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [expandedUserImage, setExpandedUserImage] = useState(null);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  useEffect(() => {
    if (!isSettingsOpen) return;
    setFullName(authUser?.fullName || "");
    setProfilePicPreview(authUser?.profilePic || "");
  }, [isSettingsOpen, authUser]);

  const filteredContacts = contacts.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  );
  const filteredChats = chats.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  );
  const visibleUsers = activeTab === "chats" ? filteredChats : filteredContacts;

  const handleDeleteChat = async (e, userId) => {
    e.stopPropagation();
    await deleteConversation(userId);
  };

  const handleExpandUserImage = (e, user) => {
    e.stopPropagation();
    if (!user.profilePic) return;
    setExpandedUserImage({
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const maxFileSize = 8 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.error("Image is too large. Please choose one under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePicPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const nextName = fullName.trim();
    const currentName = authUser?.fullName || "";
    const currentPic = authUser?.profilePic || "";
    const hasNameChanged = nextName !== currentName;
    const hasPictureChanged = Boolean(profilePicPreview) && profilePicPreview !== currentPic;

    if (!hasNameChanged && !hasPictureChanged) {
      toast("No changes to save");
      return;
    }

    const payload = {};
    if (hasNameChanged) payload.fullName = nextName;
    if (hasPictureChanged) payload.profilePic = profilePicPreview;

    const isUpdated = await updateProfile(payload);
    if (isUpdated) {
      setIsSettingsOpen(false);
    }
  };

  const renderUserItem = (user) => {
    const isOnline = onlineUsers.includes(user._id);
    const isSelected = selectedUser?._id === user._id;
    const unreadCount = unreadCounts?.[user._id] || 0;
    const unreadLabel = unreadCount > 4 ? "4+ new" : `${unreadCount} new`;

    return (
      <div
        key={user._id}
        className={`w-full flex items-center gap-2 pr-3 transition-colors ${
          isSelected
            ? "bg-gray-800 border-l-2 border-white"
            : "hover:bg-gray-900 border-l-2 border-transparent"
        }`}
      >
        <button
          onClick={() => setSelectedUser(user)}
          className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 text-left"
        >
          <div className="relative">
            <button
              type="button"
              onClick={(e) => handleExpandUserImage(e, user)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium overflow-hidden"
              aria-label={`View ${user.fullName} profile picture`}
              title={user.profilePic ? "View profile picture" : "No profile picture"}
            >
              {user.profilePic ? (
                <img src={user.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.fullName.charAt(0).toUpperCase()
              )}
            </button>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${
                isOnline ? "bg-green-500" : "bg-gray-600"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.fullName}</p>
            <p className="text-gray-500 text-xs">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </button>
        {activeTab === "chats" && unreadCount > 0 && (
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-black whitespace-nowrap">
            {unreadLabel}
          </span>
        )}
        {activeTab === "chats" && (
          <button
            type="button"
            onClick={(e) => handleDeleteChat(e, user._id)}
            className="btn btn-ghost btn-xs text-gray-500 hover:text-red-400"
            aria-label={`Delete chat with ${user.fullName}`}
            title="Delete chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 lg:w-96 border-r border-gray-800 flex flex-col bg-black">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-semibold text-white hover:text-gray-300 transition-colors"
              title="Reload page"
            >
              EchoSpace
            </button>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white w-full pl-9 input-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-gray-900 p-1">
          <button
            onClick={() => setActiveTab("chats")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "chats" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "contacts" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Contacts
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isContactsLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : visibleUsers.length === 0 ? (
          <p className="px-4 py-4 text-sm text-gray-500">
            {activeTab === "chats" ? "No chats yet" : "No contacts found"}
          </p>
        ) : (
          visibleUsers.map((user) => renderUserItem(user))
        )}
      </div>

      <div className="p-3 border-t border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
          {authUser?.profilePic ? (
            <img src={authUser.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            authUser?.fullName?.charAt(0).toUpperCase()
          )}
        </div>
        <span className="text-white text-sm truncate flex-1">{authUser?.fullName}</span>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="btn btn-ghost btn-sm text-gray-400 hover:text-white ml-auto"
          aria-label="Open profile settings"
          title="Profile settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-950 p-5 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold text-white">Profile settings</h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm text-gray-300">Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="input input-bordered w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-300">Profile picture</label>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-sm text-white overflow-hidden">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    (fullName || authUser?.fullName || "?").charAt(0).toUpperCase()
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="file-input file-input-bordered file-input-sm w-full bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-ghost text-gray-300 hover:text-white"
                disabled={isUpdatingProfile}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="btn bg-white text-black hover:bg-gray-200 border-none"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {expandedUserImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setExpandedUserImage(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpandedUserImage(null)}
              className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full bg-black/80 text-white hover:bg-black"
              aria-label="Close profile preview"
            >
              <X className="mx-auto h-4 w-4" />
            </button>
            <img
              src={expandedUserImage.profilePic}
              alt={`${expandedUserImage.fullName} profile`}
              className="h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96 rounded-full object-cover border border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
