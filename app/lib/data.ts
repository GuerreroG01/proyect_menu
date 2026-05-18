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
export const getBusinessStats = cache(() => {
    const menusPath = path.join(process.cwd(), "public", "menus");
    const catalogosPath = path.join(process.cwd(), "public", "catalogos");

    const countDirs = (dir: string) => {
        try {
            return fs.readdirSync(dir).filter((item) => {
                const itemPath = path.join(dir, item);
                return fs.statSync(itemPath).isDirectory();
            }).length;
        } catch (error) {
            console.error("Error contando directorios:", error);
            return 0;
        }
    };

    const menus = countDirs(menusPath);
    const catalogos = countDirs(catalogosPath);

    return {
        menus,
        catalogos,
        total: menus + catalogos,
    };
});