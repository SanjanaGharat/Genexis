"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, RefreshCcw, SkipForward } from "lucide-react";
import { preloadModels } from "@/lib/faceEstimation";

export default function ImageUpload({
  onImage,
  onSkip,
}: {
  onImage: (img: HTMLImageElement, dataUrl: string) => void;
  onSkip: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Warm up the ~625KB TinyFaceDetector + AgeGenderNet weights as soon as
  // this step mounts, so inference on the processing step doesn't stall on
  // a cold model load.
  useEffect(() => {
    preloadModels();
  }, []);


  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setPreview(dataUrl);
          onImage(img, dataUrl);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [onImage]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-colors duration-200 ${
          dragging ? "border-cell-400 bg-cell-400/5" : "border-white/15"
        } aspect-[4/3] flex items-center justify-center overflow-hidden`}
      >
        {preview ? (
          <motion.img
            key={preview}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={preview}
            alt="Uploaded portrait preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center px-6">
            <ImagePlus className="mx-auto text-white/30" size={36} strokeWidth={1.2} />
            <p className="mt-3 text-white/50 text-sm">Drag a photo here, or</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-3 text-sm font-semibold text-cell-400 hover:text-cell-300"
            >
              choose a file
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        {preview ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80"
          >
            <RefreshCcw size={14} /> Replace photo
          </button>
        ) : (
          <span className="text-xs text-white/30">JPG or PNG. Processed locally in your browser.</span>
        )}
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80"
        >
          Skip <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}
