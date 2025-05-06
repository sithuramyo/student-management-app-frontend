import {
    ChatMessageOption,
    ChatUserOption,
    useChatMessageOptions,
    useUserOptions,
} from "@/hooks/admins/common";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "./input";
import { useDebounce } from "use-debounce";
import LoadingButton from "./loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useApiMutation } from "@/hooks/useMutation";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth";

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

export default function Chat() {
    const { user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 300);
    const [selectedUser, setSelectedUser] = useState<ChatUserOption | null>(null);
    const [roomId, setRoomId] = useState<string>("");
    const [newMessage, setNewMessage] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);
    const pageSize = 5;

    const chatRoomMutation = useApiMutation<CreateChatRoomRequest, CreateChatRoomResponse>();

    const { data: users = [], isLoading: isUsersLoading } = useUserOptions(debouncedSearch);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isMessagesLoading,
    } = useChatMessageOptions(roomId, pageSize);

    const allMessages = data?.pages.flat() ?? [];

    const handleSelectUser = (user: ChatUserOption) => {
        setSelectedUser(user);
        if (!user.chatRoomId) {
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
                    onSuccess: (res) => {
                        setRoomId(res.data?.id ?? "");
                    },
                }
            );
        } else {
            setRoomId(user.chatRoomId);
        }
    };

    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container || isFetchingNextPage || !hasNextPage) return;

        if (container.scrollTop === 0) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isFetchingNextPage, hasNextPage]);

    const sendMessageMutation = useApiMutation<SendMessageRequest, NoResponse>();

    const handleSendMessage = () => {
        if (!newMessage.trim() || !roomId) return;
      
        sendMessageMutation.mutate(
          {
            endpoint: `/chat/send?roomId=${roomId}`,
            method: "POST",
            body: { request: { content: newMessage.trim() } },
          },
          {
            onSuccess: () => {
              setNewMessage("");
              // You can also call SignalR here if needed
              // connection?.invoke("SendMessageToRoom", roomId, newMessage.trim());
            },
          }
        );
      };
      
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="backdrop-blur-md bg-[#0f1f1a]/90 w-[320px] rounded-lg text-white shadow-2xl"
        >
            <div className="p-4 space-y-4 h-full flex flex-col">
                {!selectedUser ? (
                    <>
                        <h2 className="text-lg font-bold">Start Conversation</h2>
                        <Input
                            placeholder="Search user..."
                            className="mb-3 bg-[#1e2d27] border border-[#264f3b] focus:ring-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <ScrollArea className="h-[300px] w-[285px] scroll-smooth">
                            <div className="space-y-2">
                                {isUsersLoading ? (
                                    <div className="text-sm text-gray-400">
                                        ...<LoadingButton />...
                                    </div>
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
                                                <span
                                                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f1f1a] ${user.isOnline ? "bg-green-500" : "bg-gray-500"
                                                        }`}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Button size="icon" variant="ghost" onClick={() => setSelectedUser(null)} className="hover:bg-white/5">
                                    <ArrowLeft className="w-5 h-5 text-white" />
                                </Button>
                                <h2 className="text-lg font-semibold tracking-tight">{selectedUser?.name}</h2>
                            </div>
                        </div>
                        {isMessagesLoading ? (
                            <div className="flex items-center justify-center h-[300px] w-[285px]">
                                <LoadingButton />
                            </div>
                        ) : (
                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="h-[300px] w-[285px] overflow-y-auto scroll-smooth custom-scrollbar px-3 py-3"
                            >
                                <div className="flex flex-col gap-3">
                                    {[...allMessages]
                                        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
                                        .map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${msg.isOwnMessage ? "items-end" : "items-start"}`}
                                            >
                                                <div
                                                    className={`px-4 py-2 rounded-xl max-w-[80%] break-words text-sm shadow-sm ${msg.isOwnMessage
                                                        ? "bg-green-600 text-white rounded-br-none"
                                                        : "bg-[#2f4039] text-white rounded-bl-none"
                                                        }`}
                                                >
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-1">
                                                    {format(new Date(msg.sentAt), "hh:mm a")}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex items-center gap-2 px-3 pt-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-[#1e2d27] text-white border border-[#264f3b]"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSendMessage();
                                        }}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Send
                                    </Button>
                                </div>

                            </div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
