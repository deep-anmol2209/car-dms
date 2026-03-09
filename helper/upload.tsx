import { upload } from "@imagekit/next";



interface UploadedImageStrict {
  fileId: string;
  url: string;
  thumbnailUrl: string;
  name: string;
  size: number;
  filePath: string;
}

export function assertValidUpload(res: any): UploadedImageStrict {
  if (
    !res.fileId ||
    !res.url ||
    !res.thumbnailUrl ||
    !res.name ||
    !res.size ||
    !res.filePath
  ) {
    throw new Error("Invalid ImageKit upload response");
  }

  return {
    fileId: res.fileId,
    url: res.url,
    thumbnailUrl: res.thumbnailUrl,
    name: res.name,
    size: res.size,
    filePath: res.filePath,
  };
}





export async function uploadToImageKit(file: File) {
  const res = await fetch("/api/imagekit-auth");
  const { signature, expire, token, publicKey } = await res.json();

  const response = await upload({
    file,
    fileName: file.name,
    folder: "testdrives",
    signature,
    expire,
    token,
    publicKey,
  });

  return response;
}
