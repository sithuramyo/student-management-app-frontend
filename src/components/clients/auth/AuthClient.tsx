import AuthServer from "@/components/servers/auth/AuthServer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function AuthClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#b2afaf] via-[#f0f0f0] to-white px-6">
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <Avatar className="lg:w-32 lg:h-32 md:w-28 md:h-28 w-24 h-24">
          <AvatarImage src="/studify.png" />
        </Avatar>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <AuthServer />
      </div>
    </div>
  )
}
