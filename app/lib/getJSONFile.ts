import fs from "fs";
import path from "path";

export const getJSONFile = (filePath: string) => {
    const cleanPath = filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;

    const fullPath = path.join(process.cwd(), "public", cleanPath);

    const file = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(file);
};