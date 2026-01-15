"use client";

import type { BundledLanguage, ShikiTransformer } from "shiki";

import { createContext, use, useEffect, useRef, useState } from "react";
import type { ComponentProps, HTMLAttributes } from "react";

import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { codeToHtml } from "shiki";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockContextType {
  code: string;
}

type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  isShowLineNumbers?: boolean;
  language: BundledLanguage;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

const lineNumberTransformer: ShikiTransformer = {
  line(node, line) {
    node.children.unshift({
      children: [{ type: "text", value: String(line) }],
      properties: {
        className: [
          "inline-block",
          "min-w-10",
          "mr-4",
          "text-right",
          "select-none",
          "text-muted-foreground",
        ],
      },
      tagName: "span",
      type: "element",
    });
  },
  name: "line-numbers",
};

export async function highlightCode(
  code: string,
  language: BundledLanguage,
  isShowLineNumbers = false
) {
  const transformers: ShikiTransformer[] = isShowLineNumbers
    ? [lineNumberTransformer]
    : [];

  return await Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: "one-light",
      transformers,
    }),
    codeToHtml(code, {
      lang: language,
      theme: "one-dark-pro",
      transformers,
    }),
  ]);
}

export const CodeBlock = ({
  children,
  className,
  code,
  isShowLineNumbers = false,
  language,
  ...props
}: CodeBlockProps) => {
  const [html, setHtml] = useState<string>("");
  const [darkHtml, setDarkHtml] = useState<string>("");
  const mounted = useRef(false);

  useEffect(() => {
    void highlightCode(code, language, isShowLineNumbers).then(
      ([light, dark]) => {
        if (mounted.current) {
          setHtml(light);
          setDarkHtml(dark);
        }
      }
    );

    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, [code, language, isShowLineNumbers]);

  return (
    <CodeBlockContext value={{ code }}>
      <div
        className={cn(
          "group bg-background text-foreground relative w-full overflow-hidden rounded-md border",
          className
        )}
        {...props}
      >
        <div className="relative">
          <div
            className="[&>pre]:bg-background! [&>pre]:text-foreground! overflow-hidden dark:hidden [&_code]:font-mono [&_code]:text-sm [&>pre]:m-0 [&>pre]:p-4 [&>pre]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed."
            // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Required for syntax highlighting
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div
            className="[&>pre]:bg-background! [&>pre]:text-foreground! hidden overflow-hidden dark:block [&_code]:font-mono [&_code]:text-sm [&>pre]:m-0 [&>pre]:p-4 [&>pre]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed."
            // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Required for syntax highlighting
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />
          {children && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </CodeBlockContext>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  children,
  className,
  onCopy,
  onError,
  timeout = 2000,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = use(CodeBlockContext);

  const handleCopyToClipboard = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Browser API availability check
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      onError?.(new Error("Clipboard API not available"));

      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : DocumentDuplicateIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={handleCopyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon className="size-3.5" />}
    </Button>
  );
};
