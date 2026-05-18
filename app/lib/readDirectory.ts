import fs from "fs";
import path from "path";

const CATALOGOS_PATH = path.join(process.cwd(), "public", "catalogos");

export const getItems = () => {
    try {
        const folders = fs.readdirSync(CATALOGOS_PATH);

        return folders
            .filter(folder => {
                const folderPath = path.join(CATALOGOS_PATH, folder);
                return fs.statSync(folderPath).isDirectory();
            })
            .map(folder => {
                const infoPath = path.join(
                    CATALOGOS_PATH,
                    folder,
                    "info.json"
                );

                if (!fs.existsSync(infoPath)) {
                    return null;
                }

                const json = JSON.parse(
                    fs.readFileSync(infoPath, "utf-8")
                );

                return {
                    id: folder,
                    type: json.type || "restaurant",
                    name: json.name || folder,
                    icon: json.icon || "🍽️",
                    category: json.category || "Digital",
                    status: json.status || "Online",
                    id_type: json.id_type || null,
                    slug: json.slug || folder,
                    logo: json.logo || null,
                    whatsapp: json.whatsapp || null,
                    delivery: json.delivery || 0,
                    categories: json.categories || [],
                };
            })
            .filter(Boolean);

    } catch (error) {
        console.error("Error leyendo catalogos:", error);
        return [];
    }
};