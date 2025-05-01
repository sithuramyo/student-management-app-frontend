import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  ChatMessageOption,
  ChatUserOption,
  useChatMessageOptions,
  useUserOptions,
} from "@/hooks/admins/common";
import { useApiMutation } from "@/hooks/useMutation";
import * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "@/lib/signalr";
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from "@/store/auth";
import { ScrollArea } from "./scroll-area";

interface CreateChatRoomRequest {
  name: string;
  isGroup: boolean;
  participantIds: string[];
}

interface CreateChatRoomResponse {
  id: string;
}

interface SendMessageRequest {
  content: string;
}

interface MessageFormValues {
  content: string;
}

interface UserStatus {
  isOnline: boolean;
  lastSeen?: Date;
}

export default function Chat() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessageOption[]>([]);
  const [searchUser, setSearchUser] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<ChatUserOption | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Pagination states
  const [messagePage, setMessagePage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messageBoxRef = useRef<HTMLDivElement>(null);

  const pageSize = 5;

  const { register, handleSubmit, reset } = useForm<MessageFormValues>();
  const { data: users = [], isLoading: isUsersLoading } = useUserOptions(debouncedSearch);
  const {
    data: initialMessages = [],
    isLoading: isMessagesLoading,
  } = useChatMessageOptions(roomId, messagePage, pageSize);

  const chatRoomMutation = useApiMutation<CreateChatRoomRequest, CreateChatRoomResponse>();
  const sendMessageMutation = useApiMutation<SendMessageRequest, NoResponse>();

  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Helper function to check if a message is from current user
  const isOwnMessage = useCallback((senderId: string) => {
    return user?.sub === senderId;
  }, [user?.sub]);

  // Handle message box scroll
  const handleMessageScroll = useCallback(() => {
    const container = messageBoxRef.current;
    if (!container || isLoadingMore || !hasMoreMessages) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop <= clientHeight * 0.2) {
      setIsLoadingMore(true);
      setMessagePage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMoreMessages]);

  // Update messages when new data arrives
  useEffect(() => {
    if (initialMessages.length > 0) {
      if (messagePage === 1) {
        // Sort messages by sentAt in ascending order and set isOwnMessage
        const sortedMessages = [...initialMessages]
          .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
          .map(msg => ({
            ...msg,
            isOwnMessage: isOwnMessage(msg.senderId)
          }));
        setMessages(sortedMessages);
      } else {
        // For pagination, prepend older messages while maintaining order
        setMessages(prev => {
          const newMessages = [...initialMessages]
            .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
            .map(msg => ({
              ...msg,
              isOwnMessage: isOwnMessage(msg.senderId)
            }));
          return [...newMessages, ...prev];
        });
      }

      if (initialMessages.length < pageSize) {
        setHasMoreMessages(false);
      }
    }
    setIsLoadingMore(false);
  }, [initialMessages, messagePage, isOwnMessage]);

  // Reset pagination when room changes
  useEffect(() => {
    if (roomId) {
      setMessagePage(1);
      setHasMoreMessages(true);
      setMessages([]);
    }
  }, [roomId]);

  useEffect(() => {
    const container = document.querySelector(".custom-scrollbar");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => {
      const cleanup = async () => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
          try {
            await connectionRef.current.stop();
            connectionRef.current = null;
            setConnection(null);
            setConnectionState('disconnected');
          } catch (error) {
          }
        }
      };
      cleanup();
    };
  }, []);

  // Setup SignalR connection
  const setupConnection = async () => {
    try {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        return connectionRef.current;
      }

      setConnectionState('connecting');
      const conn = createSignalRConnection();

      conn.onclose(() => {
        setConnectionState('disconnected');
      });

      conn.on("ReceiveMessage", (message: ChatMessageOption) => {
        setMessages(prev => [...prev, {
          ...message,
          isOwnMessage: isOwnMessage(message.senderId)
        }]);
      });

      await conn.start();
      setConnectionState('connected');
      setConnection(conn);
      connectionRef.current = conn;
      return conn;
    } catch (error) {
      setConnectionState('disconnected');
      return null;
    }
  };

  // Handle room changes
  const handleSelectUser = async (user: ChatUserOption) => {
    try {
      let currentConnection = connectionRef.current;

      if (!currentConnection || currentConnection.state !== signalR.HubConnectionState.Connected) {
        currentConnection = await setupConnection();
        if (!currentConnection) {
          return;
        }
      }

      // First leave current room if any
      if (roomId) {
        await currentConnection.invoke("LeaveRoom", roomId);
        setRoomId(""); // Clear current room ID
      }

      // Set selected user first
      setSelectedUser(user);

      if (user.chatRoomId) {
        await currentConnection.invoke("JoinRoom", user.chatRoomId);
        setRoomId(user.chatRoomId); // This will trigger message fetch
      } else {
        const request: CreateChatRoomRequest = {
          name: "",
          isGroup: false,
          participantIds: [user.id],
        };

        chatRoomMutation.mutate(
          {
            endpoint: "/chat/room",
            method: "POST",
            body: { request },
          },
          {
            onSuccess: async (res) => {
              const newRoomId = res.data?.id ?? "";
              if (currentConnection?.state === signalR.HubConnectionState.Connected) {
                await currentConnection.invoke("JoinRoom", newRoomId);
                setRoomId(newRoomId); // This will trigger message fetch
              }
            },
          }
        );
      }
    } catch (error) {
    }
  };

  const onSubmit = (data: MessageFormValues) => {
    if (!data.content.trim() || !roomId || !user) return;

    // Send the message to the server
    sendMessageMutation.mutate(
      {
        endpoint: `/chat/send?roomId=${roomId}`,
        method: "POST",
        body: { request: { content: data.content.trim() } },
      },
      {
        onSuccess: () => {
          reset(); // Reset form after successful send
        }
      }
    );
  };

  const getStatusDisplay = (userId: string) => {
    const status = userStatuses[userId];
    if (!status) return null;

    if (status.isOnline) {
      return <span className="text-green-500 text-xs">Online</span>;
    }

    if (status.lastSeen) {
      return (
        <span className="text-gray-400 text-xs">
          Last seen {formatDistanceToNow(status.lastSeen, { addSuffix: true })}
        </span>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.25 }}
      className="backdrop-blur-md bg-[#0f1f1a]/90 w-[320px] rounded-lg text-white shadow-2xl"
    >
      {!selectedUser ? (
        <div className="p-4 space-y-4 h-full flex flex-col">
          <h2 className="text-lg font-bold">Chats</h2>
          <Input
            placeholder="Search user..."
            className="mb-3 bg-[#1e2d27] border border-[#264f3b] focus:ring-white"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <ScrollArea className="h-[300px] w-[285px]">
            <div className="space-y-2">
              {isUsersLoading ? (
                <div className="text-sm text-gray-400">Loading users...</div>
              ) : (
                users.map((user: ChatUserOption) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-[#1e2d27] transition"
                  >
                    <div className="relative">
                      <Avatar>
                        {user.profile ? (
                          <AvatarImage src={user.profile} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-[#264f3b] text-white font-medium">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {userStatuses[user.id]?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f1f1a]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {getStatusDisplay(user.id)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#264f3b]">
            <Button size="icon" variant="ghost" onClick={() => setSelectedUser(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Avatar>
                {selectedUser.profile ? (
                  <AvatarImage src={selectedUser.profile} alt={selectedUser.name} />
                ) : (
                  <AvatarFallback className="bg-[#1e2d27] text-white font-medium">
                    {selectedUser.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              {userStatuses[selectedUser.id]?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f1f1a]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{selectedUser.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400">{selectedUser.email}</p>
                {getStatusDisplay(selectedUser.id)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-green-500' :
                  connectionState === 'connecting' ? 'bg-yellow-500' :
                    'bg-red-500'
                }`} />
              <span className="text-xs text-gray-400">
                {connectionState === 'connected' ? 'Connected' :
                  connectionState === 'connecting' ? 'Connecting...' :
                    'Disconnected'}
              </span>
            </div>
          </div>

          <div
            ref={messageBoxRef}
            onScroll={handleMessageScroll}
            className="p-4 overflow-y-auto flex-1 flex flex-col gap-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#264f3b] [&::-webkit-scrollbar-track]:bg-[#0f1f1a] [&::-webkit-scrollbar-thumb:hover]:bg-[#366d52]"
          >
            {isMessagesLoading && messagePage === 1 ? (
              <div className="text-sm text-gray-400 text-center">Loading messages...</div>
            ) : (
              <>
                {isLoadingMore && (
                  <div className="text-sm text-gray-400 text-center py-2">
                    Loading more...
                  </div>
                )}
                {messages.map((msg) => {
                  const isOwn = msg.isOwnMessage;
                  const time = msg.sentAt ? new Date(msg.sentAt) : new Date();
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm break-words relative ${isOwn
                          ? "bg-white text-black self-end rounded-br-none"
                          : "bg-[#1e2d27] text-white self-start rounded-bl-none"
                        }`}
                    >
                      <div>{msg.content}</div>
                      <div
                        className={`text-[10px] mt-1 ${isOwn ? "text-right text-gray-500" : "text-left text-gray-400"
                          }`}
                      >
                        {time.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-3 border-t border-[#264f3b] flex items-center gap-2 bg-[#0f1f1a]/90"
          >
            <Input
              {...register("content")}
              className="flex-1 bg-[#1e2d27] text-white placeholder:text-gray-400 border border-[#264f3b] focus:ring-white"
              placeholder="Type your message..."
            />
            <Button type="submit" size="sm" className="text-sm px-4" variant="secondary">
              Send
            </Button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
