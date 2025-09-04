"use client";

import { memo, ReactNode, ImgHTMLAttributes } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CustomCodeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const markdownComponents: Options["components"] = {
  code({ inline, className, children, ...props }: CustomCodeProps) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children || "").replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code
        className={cn(
          "text-sm bg-muted px-1 py-0.5 rounded break-words",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 table-auto">
        {children}
      </table>
    </div>
  ),

  img: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt } = props;

    if (typeof src === "string" && src) {
      return (
        <div className="relative w-full my-4 overflow-hidden rounded-md aspect-video">
          <Image
            src={src}
            alt={alt || "Image from markdown"}
            fill
            className="object-contain"
          />
        </div>
      );
    }
    return null;
  },
  p: ({ children }) => (
    <p className="whitespace-pre-wrap break-words">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words"
    >
      {children}
    </a>
  ),
};

interface Props {
  markdown: string;
  className?: string;
}

export const MarkdownPreview = memo(({ markdown, className }: Props) => {
  return (
    <Card className="border rounded-md overflow-hidden">
      <ScrollArea className="h-[600px] w-full">
        <div className="p-6">
          <div
            className={cn(
              "prose dark:prose-invert max-w-none break-words",
              className
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
});

MarkdownPreview.displayName = "MarkdownPreview";
