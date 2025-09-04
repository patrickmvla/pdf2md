"use client";

import { useEffect, useState } from "react";

interface Props {
  file: File | null;
  isConverting: boolean;
  onLoad: () => void;
  onConversionComplete: (markdown: string) => void;
  onError: (error: string) => void;
}

const PDF2MDLoader = ({
  onConversionComplete,
  file,
  isConverting,
  onError,
  onLoad,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdf2md, setPdf2md] = useState<any>(null);

  useEffect(() => {
    const loadPdf2md = async () => {
      try {
        const pdf2mdModule = await import("@opendocsg/pdf2md");
        setPdf2md(() => pdf2mdModule.default);
        onLoad();
      } catch (error) {
        console.error("Failed to load pdf2md library:", error);
        onError("Failed to load conversion library. Please try again later.");
      }
    };
    loadPdf2md();
  }, [onLoad, onError]);

  useEffect(() => {
    const convertPdf = async () => {
      if (!file || !pdf2md || !isConverting) return;

      try {
        const pdfBuffer = await file.arrayBuffer();

        const markdown = await pdf2md(pdfBuffer);

        onConversionComplete(markdown);
      } catch (error) {
        console.error("Error converting PDF:", error);
        onError(
          "Failed to convert PDF. The file might be corrupted or unsupported"
        );
      }
    };
    if (isConverting && file && pdf2md) {
      convertPdf();
    }
  }, [file, pdf2md, isConverting, onConversionComplete, onError]);
  return null;
};

export default PDF2MDLoader;
