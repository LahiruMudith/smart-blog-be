import multer from "multer";

//we can access disk or memory
const storage = multer.memoryStorage()

export const upload = multer({ storage}) //multer({ storage:storage})