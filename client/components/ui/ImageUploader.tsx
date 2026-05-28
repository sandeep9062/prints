"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function ImageUploader({
  onUpload,
  onRemove,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevPreviews) => [...prevPreviews, ...newPreviews]);

      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });

    onRemove(index);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary-foreground" : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2 text-primary">Drop the files here...</p>
        ) : (
          <p className="mt-2 text-gray-500">
            Drag & drop some files here, or click to select files
          </p>
        )}
      </div>

      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
