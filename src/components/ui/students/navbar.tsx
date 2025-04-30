import { useAuthStore } from "@/store/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { user } = useAuthStore();

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="w-full px-6 py-3 bg-white border-b shadow-sm flex items-center justify-between">
      {/* Logo + App Name */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center">
          <img
            src="/studify.png"
            alt="Studify"
            className="w-10 h-10 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Studify</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <Avatar className="w-10 h-10 border shadow-sm">
          {user?.profile && user.profile !== "N/A" ? (
            <AvatarImage src={user.profile} alt={user.name} className="object-cover" />
          ) : (
            <AvatarFallback>{initials || "ST"}</AvatarFallback>
          )}
        </Avatar>
      </div>
    </header>
  );
}
