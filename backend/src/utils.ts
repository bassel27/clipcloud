import path from "path";

export function nowDateSQLFormat() {
   return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export function isImage(filePath: string): boolean {
   const ext = path.extname(filePath).toLowerCase();
   if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      return true;
    }
   return false;
}

export function isVideo(filePathOrName: string): boolean {
   const ext = path.extname(filePathOrName).toLowerCase();
   if (['.mp4', '.mov'].includes(ext)) {
      return true;
    }
   return false;
}

export function getPublicUrl(filePath: string): string {
  const baseUrl = process.env.BASE_URL;
  const fileName = path.basename(filePath);  
   const parentFolder = path.basename(path.dirname(filePath)); 
   const result = path.join(parentFolder, fileName);
  return `${baseUrl}/${result}`;
}
