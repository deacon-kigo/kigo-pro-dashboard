"use client";

import type { Role } from "@/components/prod/utils/session/store/types";

import { PlusCircleIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/prod/button";
import { GlowWrapper } from "@/components/prod/button/atoms/glow-wrapper";
import { ROUTES } from "@/components/prod/constants/routes";

const ACTION_BUTTONS = {
  admin: (
    <GlowWrapper>
      <Button
        href={ROUTES.web.catalogFilters.create}
        icon={<PlusCircleIcon className="size-5" />}
      >
        Add Catalog Filter
      </Button>
    </GlowWrapper>
  ),
};

interface HeaderProps {
  userRole: Role;
}

const Header = ({ userRole }: HeaderProps) => (
  <header className="border-border-light fixed top-0 right-0 z-30 flex h-[72px] w-screen items-center border-b px-6 transition-all duration-300 ease-in-out">
    <div className="via-pastel-blue/5 to-pastel-purple/10 absolute inset-0 bg-gradient-to-r from-white/90 backdrop-blur-md" />
    <div className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center">
      <div className="ml-auto flex items-center gap-4">
        {ACTION_BUTTONS[userRole]}
      </div>
    </div>
  </header>
);

export { Header };
