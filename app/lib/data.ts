import { cache } from "react";
import fs from "fs";
import path from "path";

export const getBusiness = cache((folder: string, slug: string) => {
    const filePath = path.join(
        process.cwd(),
        "public",
        folder,
        slug,
        "info.json"
    );

    const file = fs.readFileSync(filePath, "utf8");

    return JSON.parse(file);
});

export const getItems = cache((folder: string) => {
    const dir = path.join(
        process.cwd(),
        "public",
        folder
    );

    const folders = fs.readdirSync(dir);

    return folders
        .filter((item) => {
            const itemPath = path.join(dir, item);

            return fs.statSync(itemPath).isDirectory();
        })
        .map((item) => {
            const infoPath = path.join(
                dir,
                item,
                "info.json"
            );

            if (!fs.existsSync(infoPath)) {
                return null;
            }

            const content = fs.readFileSync(infoPath, "utf8");

            return JSON.parse(content);
        })
        .filter(Boolean);
});

export const getCategory = cache(
    (
        folder: string,
        slug: string,
        categoryFile: string
    ) => {
        const filePath = path.join(
            process.cwd(),
            "public",
            folder,
            slug,
            "categorias",
            categoryFile
        );

        const file = fs.readFileSync(filePath, "utf8");

        return JSON.parse(file);
    }
);