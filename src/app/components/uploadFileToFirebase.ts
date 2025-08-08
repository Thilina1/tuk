import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";

export const uploadFileToFirebase = (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileRef = ref(storage, `${path}/${Date.now()}_${safeName}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: track progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress.toFixed(0)}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
