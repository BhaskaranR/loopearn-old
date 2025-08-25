import type { Database } from "@loopearn/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@loopearn/ui/avatar";
import type { AvatarProps } from "@radix-ui/react-avatar";
import { User2 } from "lucide-react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<
    Database["public"]["Tables"]["users"]["Row"],
    "avatar_url" | "full_name" | "username"
  >;
  className?: string;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  if (!user?.full_name?.trim()) {
    return (
      <Avatar {...props}>
        <AvatarFallback>
          <User2 className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <Avatar {...props}>
      {user.avatar_url ? (
        <AvatarImage alt="Picture" src={`${user.avatar_url}`} />
      ) : (
        <AvatarFallback>
          {`${!user.full_name ? "" : stringAvatar(user.full_name || " ")}`}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  const trimmedName = (name || "").trim();
  return `${trimmedName.split(" ")[0][0]}${trimmedName.split(" ")[1][0]}`.toUpperCase();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function formatName(fullName) {
  const trimmedName = (fullName || "").trim();
  return trimmedName.split(" ").map(capitalizeFirstLetter).join(" ");
}
