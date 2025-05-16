"use client";

import { ReactNode, useEffect, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Only execute theme logic after the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid theme-related hydration issues by rendering children only on the client side
  // Since we aren't using dark mode yet, we force the light theme
  return (
    <>
      {mounted ? (
        children
      ) : (
        <div style={{ visibility: "hidden" }}>{children}</div>
      )}
    </>
  );
}
