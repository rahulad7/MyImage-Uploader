import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC6pj8YONiBtYkjnMKmDf249eYZ6mPVEo0",
    authDomain: "image-uploader-a3455.firebaseapp.com",
    projectId: "image-uploader-a3455",
    storageBucket: "image-uploader-a3455.appspot.com",
    messagingSenderId: "1072807532035",
    appId: "1:1072807532035:web:9f1339af32ec283dbee036",
    measurementId: "G-NR5759T2KY"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
