"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function ImageUpload({
  onImagesChange,
}: {
  onImagesChange: (files: File[]) => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    onImagesChange(newFiles);

    // Create local preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Revoke the URL to save memory
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <p className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Зураг оруулах
      </p>

      {/* Dropzone Area */}
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
        <div className="flex min-h-60 flex-col items-center justify-center rounded-4xl border-2 border-dashed border-[#ece3ff] bg-[#f8f6ff] p-6 transition-colors hover:bg-[#f0edff]">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Upload className="h-6 w-6 text-[#2a00ff]" />
          </div>
          <p className="text-sm font-bold text-[#1a0b3b]">
            Зураг сонгох эсвэл чирж оруулна уу
          </p>
          <p className="text-[10px] text-slate-400">
            JPG, PNG, WebP (Дээд тал нь 10 зураг)
          </p>
        </div>
      </div>

      {/* Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {previews.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-[#ece3ff]"
            >
              <img
                src={url}
                alt="Preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
