"use client";

import { LinkButton } from "@/types/tmt-campaign";

interface LinkButtonsProps {
  buttons: LinkButton[];
}

export default function LinkButtons({ buttons }: LinkButtonsProps) {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-2 px-6">
      {buttons.map((button) => {
        const styles: React.CSSProperties = {
          maxWidth: `${button.maxWidth}px`,
          borderRadius: `${button.borderRadius}px`,
        };

        if (button.style === "contained") {
          styles.backgroundColor = button.backgroundColor;
          styles.color = button.textColor;
        } else if (button.style === "outline") {
          styles.border = `2px solid ${button.backgroundColor}`;
          styles.color = button.backgroundColor;
          styles.backgroundColor = "transparent";
        } else {
          styles.color = button.backgroundColor;
          styles.backgroundColor = "transparent";
          styles.textDecoration = "underline";
        }

        return (
          <a
            key={button.id}
            href={button.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 text-sm text-center font-medium transition-opacity hover:opacity-80"
            style={styles}
          >
            {button.text || "Link"}
          </a>
        );
      })}
    </div>
  );
}
