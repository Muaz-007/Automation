"use client";

import { useState, useTransition, useRef } from "react";
import { AlertCircle, CheckCircle2, FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadInventoryCsv, type ActionResult } from "@/app/actions/inventory";
import { useToast } from "@/components/toaster";

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function handleFile(f: File | null) {
    setResult(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!f.name.toLowerCase().endsWith(".csv")) {
      toast("error", "Please select a .csv file");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast("error", "File too large (max 2MB)");
      return;
    }
    setFile(f);
  }

  function submit() {
    if (!file) {
      toast("error", "Select a CSV file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    start(async () => {
      const r = await uploadInventoryCsv(undefined, formData);
      setResult(r);
      if (r.ok) {
        toast("success", r.message ?? "Uploaded");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toast("error", r.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <label
        htmlFor="csv-file"
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
      >
        <input
          id="csv-file"
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          {file ? <FileText className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
        </div>
        {file ? (
          <>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB · ready to upload
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium">
              Click to select a CSV file
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or drag and drop · max 2MB
            </p>
          </>
        )}
      </label>

      {result && !result.ok && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {result && result.ok && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{result.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Need a sample? Download our{" "}
          <a
            href="https://github.com/Muaz-007/Automation/tree/main/demo-inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            demo CSV sheets
          </a>{" "}
          (real estate / e-commerce / healthcare).
        </p>
        <div className="flex shrink-0 gap-2">
          {file && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFile(null);
                setResult(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={pending}
            >
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
          <Button size="sm" onClick={submit} disabled={!file || pending}>
            <Upload className="h-4 w-4" />
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
