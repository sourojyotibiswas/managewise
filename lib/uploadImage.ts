import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    "6557571202e2cfda38df",
    ID.unique(),
    file
  );
  return fileUploaded;
};

export default uploadImage;
