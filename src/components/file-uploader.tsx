"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";

const PDF2MDLoader = dynamic(() => import("@/components/pdf2md-loader"), {
  ssr: false,
});

interface Props {
  onConversionComplete: (markdown: string, file: File) => void;
  isConverting: boolean;
  setIsConverting: (isConverting: boolean) => void;
}

export const FileUploader = ({
  onConversionComplete,
  isConverting,
  setIsConverting,
}: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdf2mdLoaded, setPdf2mdLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isConverting) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 1;
          return prev;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isConverting]);

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);

    if (fileRejections.length > 0) {
      const firstError = fileRejections[0].errors[0];
      if (firstError.code === "file-too-large") {
        setError("File size exceeds 10MB limit");
      } else if (firstError.code === "file-invalid-type") {
        setError("Please upload a PDF file");
      } else {
        setError(firstError.message);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const handleConvert = async () => {
    if (!selectedFile || !pdf2mdLoaded) return;
    setIsConverting(true);
    setError(null);
  };

  return (
    <>
      <PDF2MDLoader
        file={selectedFile}
        isConverting={isConverting}
        onLoad={() => setPdf2mdLoaded(true)}
        onConversionComplete={(markdown) => {
          if (selectedFile) {
            setProgress(100);
            onConversionComplete(markdown, selectedFile);
            setIsConverting(false);
          }
        }}
        onError={(errorMsg) => {
          setError(errorMsg);
          setIsConverting(false);
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card
        {...getRootProps()}
        className={`border-2 ${
          isDragActive
            ? "border-emerald-500 border-dashed bg-emerald-500/5"
            : "border-dashed"
        } p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-muted rounded-full p-3">
            <Upload className="h-6 w-6 text-emerald-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-1">Upload your PDF</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {isDragActive
                ? "Drop the file here ..."
                : "Drag and drop your file here or click to browse"}
            </p>

            {selectedFile && !isConverting && (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
                <File className="h-4 w-4" />
                {selectedFile.name}
              </div>
            )}
          </div>

          {isConverting ? (
            <div className="w-full max-w-xs">
              <Progress
                value={progress}
                className="h-2 mb-2 [&>*]:bg-emerald-500"
              />
              <p className="text-xs text-muted-foreground">
                Converting... {progress}%
              </p>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  open();
                }}
                disabled={isConverting}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Select PDF
              </Button>

              {selectedFile && pdf2mdLoaded && (
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleConvert();
                  }}
                  disabled={isConverting}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Convert to Markdown
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
