"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FileUploader } from "@/components/file-uploader";
import { HeroSection } from "@/components/hero-section";
import { ResultsSection } from "@/components/results-section";

const COPIED_TIMEOUT_MS = 2000;

export default function Home() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConverting) {
      setMarkdown(null);
      setFileName(null);
    }
  }, [isConverting]);

  useEffect(() => {
    if (markdown && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [markdown]);

  // --- HANDLERS ---
  const handleConversionComplete = (result: string, file: File) => {
    setMarkdown(result);
    setFileName(file.name);
  };

  const handleCopy = useCallback(async () => {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPIED_TIMEOUT_MS);
  }, [markdown]);

  const handleDownload = useCallback(() => {
    if (!markdown || !fileName) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(/\.pdf$/i, "") + ".md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [markdown, fileName]);

  const handleStartOver = () => {
    setMarkdown(null);
    setFileName(null);
    uploaderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/20">
      <div className="container mx-auto py-16 px-4 max-w-4xl">
        <HeroSection />

        <div ref={uploaderRef} id="file-uploader" className="grid gap-12 mt-24">
          <div className="transition-all duration-200 hover:scale-[1.01]">
            <FileUploader
              onConversionComplete={handleConversionComplete}
              isConverting={isConverting}
              setIsConverting={setIsConverting}
            />
          </div>

          {markdown && (
            <ResultsSection
              ref={resultsRef}
              markdown={markdown}
              fileName={fileName}
              isCopied={isCopied}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        <footer className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/patrickmvla/pdf2md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              Mvula
            </a>
            . Star on GitHub.
          </p>
        </footer>
      </div>
    </main>
  );
}
