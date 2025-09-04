import { forwardRef } from "react";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Code, Check, Copy, RotateCcw } from "lucide-react";

interface ResultsSectionProps {
  markdown: string;
  fileName: string | null;
  isCopied: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onStartOver: () => void;
}

export const ResultsSection = forwardRef<HTMLDivElement, ResultsSectionProps>(
  ({ markdown, fileName, isCopied, onCopy, onDownload, onStartOver }, ref) => {
    return (
      <div ref={ref} className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            {/* --- STYLE UPDATE: Changed gradient text to solid emerald green --- */}
            <h2 className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-500">
              Conversion Result
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {fileName?.replace(/\.pdf$/i, "")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onStartOver}
              variant="ghost"
              className="h-9 font-medium"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Start Over
            </Button>
            <Button
              onClick={onCopy}
              variant="outline"
              className="h-9 font-medium"
            >
              {isCopied ? (
                // This was already emerald, which is great
                <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="mr-1.5 h-4 w-4" />
              )}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
            {/* --- STYLE UPDATE: Changed button color to emerald green --- */}
            <Button
              onClick={onDownload}
              className="h-9 font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <FileText className="mr-1.5 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="flex h-12 items-center gap-4 px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              {/* --- STYLE UPDATE: Active tab trigger is now emerald green --- */}
              <TabsTrigger
                value="preview"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 transition-all"
              >
                <FileText className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="markdown"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 transition-all"
              >
                <Code className="h-4 w-4" />
                Markdown
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="p-0">
              <MarkdownPreview markdown={markdown} />
            </TabsContent>
            <TabsContent value="markdown">
              <ScrollArea className="h-[600px] w-full">
                <div className="p-6">
                  <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                    <code className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                      {markdown}
                    </code>
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
);

ResultsSection.displayName = "ResultsSection";
