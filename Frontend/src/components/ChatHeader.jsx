import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { useChatStore } from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, users, getUsers, showOnlineOnly } = useAuthStore();

  // Fetch users when the component mounts
  useEffect(() => {
    getUsers?.();
  }, [getUsers]);

  // Filter online users if the option is enabled
  const filteredUsers = showOnlineOnly
    ? users?.filter((user) => onlineUsers.includes(user._id))
    : users;

  console.log({ users, onlineUsers, showOnlineOnly, filteredUsers });

  if (!selectedUser) return null; // Prevent rendering if no user is selected

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName || "User"}
              />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName || "Unknown"}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
