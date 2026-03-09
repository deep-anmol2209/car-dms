// "use client";

// import {
//   upload,
//   ImageKitAbortError,
//   ImageKitInvalidRequestError,
//   ImageKitServerError,
//   ImageKitUploadNetworkError,
// } from "@imagekit/next";
// import {
//   useRef,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";

// const MAX_SIZE_MB = 10;

// export interface UploadedImage {
//   fileId: string;
//   url: string;
//   thumbnailUrl: string;
//   name: string;
//   size: number;
//   filePath: string;
// }

// export interface ImageUploaderRef {
//   upload: () => void;
// }

// interface ImageUploaderProps {
//   onSuccess: (res: UploadedImage[]) => void;
//   folder?: string;
//   multiple?: boolean;
// }

// function toUploadedImage(res: any): UploadedImage {
//   if (
//     !res.fileId ||
//     !res.url ||
//     !res.thumbnailUrl ||
//     !res.name ||
//     !res.size ||
//     !res.filePath
//   ) {
//     throw new Error("Invalid upload response from ImageKit");
//   }

//   return {
//     fileId: res.fileId,
//     url: res.url,
//     thumbnailUrl: res.thumbnailUrl,
//     name: res.name,
//     size: res.size,
//     filePath: res.filePath,
//   };
// }

// export const ImageUploader = forwardRef<
//   ImageUploaderRef,
//   ImageUploaderProps
// >(function ImageUploader(
//   { onSuccess, folder = "temp", multiple = false },
//   ref
// ) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] =
//     useState<"idle" | "uploading" | "success" | "error">("idle");
//   const [error, setError] = useState<string | null>(null);

//   const authenticator = async () => {
//     const res = await fetch("/api/imagekit-auth");
//     if (!res.ok) throw new Error("Auth failed");
//     return res.json();
//   };

//   const validateFile = (file: File) => {
//     if (!file.type.startsWith("image/")) {
//       throw new Error("Only image files are allowed");
//     }
//     if (file.size > MAX_SIZE_MB * 1024 * 1024) {
//       throw new Error("Image must be less than 10MB");
//     }
//   };
// const handleUpload = async () => {
//   const files = inputRef.current?.files;
//   if (!files || files.length === 0) {
//     setError("Please select at least one file");
//     return;
//   }

//   try {
//     setStatus("uploading");
//     setError(null);
//     setProgress(0);

//     const fileArray = Array.from(files);

//     const uploadedImages: UploadedImage[] = [];

//     await Promise.all(
//       fileArray.map(async (file) => {
//         validateFile(file);

//         const { signature, expire, token, publicKey } =
//           await authenticator();

//         const res = await upload({
//           file,
//           fileName: file.name,
//           folder,
//           signature,
//           expire,
//           token,
//           publicKey,
//         });

//         uploadedImages.push(toUploadedImage(res));
//       })
//     );

//     setStatus("success");

//     // ✅ Send all images at once
//     onSuccess(uploadedImages);

//   } catch (err) {
//     setStatus("error");

//     if (err instanceof ImageKitAbortError)
//       setError("Upload aborted");
//     else if (err instanceof ImageKitInvalidRequestError)
//       setError(err.message);
//     else if (err instanceof ImageKitUploadNetworkError)
//       setError("Network error");
//     else if (err instanceof ImageKitServerError)
//       setError("Server error");
//     else setError((err as Error).message);
//   }
// };



//   // ✅ expose upload() to parent
//   useImperativeHandle(ref, () => ({
//     upload: handleUpload,
//   }));

//   return (
//     <div className="space-y-2">
//       <input
//         type="file"
//         ref={inputRef}
//         accept="image/*"
//         multiple={multiple}
//         hidden
//          onChange={() => {
//     handleUpload(); 
//   }}
//       />

//       <button
//         type="button"
//         onClick={() => inputRef.current?.click()}
//         className="flex items-center gap-2 border rounded-md px-4 py-2"
//       >
//         <Upload className="w-4 h-4" />
//         Select Image
//       </button>

//       {status === "uploading" && (
//         <div className="flex items-center gap-2 text-sm">
//           <Loader2 className="w-4 h-4 animate-spin" />
//           Uploading… {progress}%
//         </div>
//       )}

//       {status === "success" && (
//         <div className="flex items-center gap-2 text-green-600 text-sm">
//           <CheckCircle className="w-4 h-4" />
//           Uploaded successfully
//         </div>
//       )}

//       {status === "error" && error && (
//         <div className="flex items-center gap-2 text-red-600 text-sm">
//           <XCircle className="w-4 h-4" />
//           {error}
//         </div>
//       )}
//     </div>
//   );
// });


"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Upload, XCircle } from "lucide-react";

const MAX_SIZE_MB = 10;

export interface ImageUploaderRef {
  clear: () => void;
}

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  defaultImage?: string | null;
}

export const ImageUploader = forwardRef<
  ImageUploaderRef,
  ImageUploaderProps
>(function ImageUploader(
  { onFilesChange, multiple = false , defaultImage },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error("Image must be less than 10MB");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setError(null);

      const fileArray = Array.from(files);

      fileArray.forEach(validateFile);
      
      // Create local preview URLs
      const previewUrls = fileArray.map((file) =>
        URL.createObjectURL(file)
      );

      // Cleanup old previews before replacing
      previews.forEach((url) => URL.revokeObjectURL(url));

      setPreviews(previewUrls);

      // Send files to parent (DO NOT upload here)
      onFilesChange(fileArray);

    } catch (err) {
      console.log(err);
      
      setError((err as Error).message);
    }
  };
useEffect(() => {
  if (defaultImage) {
    setPreviews([defaultImage]);
  }
}, [defaultImage]);

  // Cleanup memory on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Expose clear() to parent if needed
  useImperativeHandle(ref, () => ({
    clear: () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = "";
    },
  }));

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 border rounded-md px-4 py-2"
      >
        <Upload className="w-4 h-4" />
        Select Image
      </button>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <XCircle className="w-4 h-4" />
          {error}
        </div>
      )}

    </div>
  );
});
