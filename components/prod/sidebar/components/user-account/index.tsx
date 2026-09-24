import type { Role } from "@/components/prod/utils/session/store/types";

import { useSidebarContext } from "../../hooks/use-sidebar-context";
import { getInitials } from "../../utils/get-initials";

interface UserAccountProps {
  userName: string;
  userRole: Role;
}

const UserAccount = ({ userName, userRole }: UserAccountProps) => {
  const { isCollapsed } = useSidebarContext();

  return (
    <div
      className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
      data-testid="user-account-container"
    >
      <div
        className="bg-pastel-purple flex max-h-9 min-h-9 max-w-9 min-w-9 items-center justify-center rounded-full text-sm font-semibold text-indigo-500 shadow-sm"
        data-testid="avatar-container"
      >
        {getInitials(userName)}
      </div>

      <div
        aria-hidden={isCollapsed}
        className={`ml-3 overflow-hidden ${isCollapsed ? "hidden" : ""}`}
        data-testid="user-account-info"
        hidden={isCollapsed}
      >
        <p className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
          {userName}
        </p>
        <p className="text-text-muted text-xs">{userRole}</p>
      </div>
    </div>
  );
};

export { UserAccount };
