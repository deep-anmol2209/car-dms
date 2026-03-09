import ImageKit from "imagekit"
import axios from "axios";
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function deleteFiles(fileIds: string[]) {
  try {
    const response = await axios.post(
      "https://api.imagekit.io/v1/files/batch/deleteByFileIds",
      { fileIds },
      {
        auth: {
          username: process.env.IMAGEKIT_PRIVATE_KEY!,
          password: "",
        },
      }
    );

    const data = response.data;

    // ✅ Success condition
    if (
      data &&
      Array.isArray(data.successfullyDeletedFileIds)
    ) {
      return {
        success: true,
        deletedIds: data.successfullyDeletedFileIds,
      };
    }

    return {
      success: false,
      error: "Unexpected ImageKit response",
    };

  } catch (error: any) {
    console.error("[IMAGEKIT_DELETE_ERROR]", error.message);

    return {
      success: false,
      error: error.message || "Image deletion failed",
    };
  }
}

export async function deleteFile(fileId: string) {
  try {
    const response = await axios.delete(
      `https://api.imagekit.io/v1/files/${fileId}`,
      {
        auth: {
          username: process.env.IMAGEKIT_PRIVATE_KEY!,
          password: "",
        },
      }
    );

    const data = response.data;

    // ✅ Success condition
    if (data && data.success === true) {
      return {
        success: true,
        deletedId: fileId,
      };
    }

    return {
      success: false,
      error: "Unexpected ImageKit response",
    };

  } catch (error: any) {
    console.error("[IMAGEKIT_DELETE_ERROR]", error.message);

    return {
      success: false,
      error: error.message || "Image deletion failed",
    };
  }
}

export async function updateFile(fileId: string, url: string) {
  try {

    const deleteImage= await deleteFile(fileId);
    if(!deleteImage.success){
      return {
        success: false,
        error: deleteImage.error,
      };
    }
    const response = await axios.post(
      `https://api.imagekit.io/v1/files/${fileId}`,
      { url },
      {
        auth: {
          username: process.env.IMAGEKIT_PRIVATE_KEY!,
          password: "",
        },
      }
    );

    const data = response.data;

    // ✅ Success condition
    if (data && data.success === true) {
      return {
        success: true,
        updatedId: fileId,
      };
    }

    return {
      success: false,
      error: "Unexpected ImageKit response",
    };

  } catch (error: any) {
    console.error("[IMAGEKIT_UPDATE_ERROR]", error.message);

    return {
      success: false,
      error: error.message || "Image update failed",
    };
  }
}

