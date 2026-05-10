import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, Search, MessageCircle } from "lucide-react";

const Sidebar = () => {
  const { contacts, getContacts, isContactsLoading, selectedUser, setSelectedUser } = useChatStore();
  const { authUser, logout, onlineUsers } = useAuthStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const filteredContacts = contacts.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 lg:w-96 border-r border-gray-800 flex flex-col bg-black">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-white">EchoSpace</span>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white w-full pl-9 input-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isContactsLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No contacts found</p>
        ) : (
          filteredContacts.map((contact) => {
            const isOnline = onlineUsers.includes(contact._id);
            const isSelected = selectedUser?._id === contact._id;

            return (
              <button
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? "bg-gray-800 border-l-2 border-white"
                    : "hover:bg-gray-900 border-l-2 border-transparent"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                    {contact.profilePic ? (
                      <img src={contact.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      contact.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${
                      isOnline ? "bg-green-500" : "bg-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{contact.fullName}</p>
                  <p className="text-gray-500 text-xs">{isOnline ? "Online" : "Offline"}</p>
                </div>
              </button>
            );
          })
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
        <span className="text-white text-sm truncate">{authUser?.fullName}</span>
      </div>
    </div>
  );
};

export default Sidebar;
