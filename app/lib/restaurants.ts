import fs from "fs";
import path from "path";

const formatName = (id: string) => {
    return id
        .replace(/_/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export function getRestaurants() {
    const menusDirectory = path.join(
        process.cwd(),
        "public",
        "menus"
    );

    try {
        const files = fs.readdirSync(menusDirectory);

        return files
        .filter(file => file.endsWith(".json"))
        .map(file => {
            const id = file.replace(".json", "");

            return {
            id,
            name: formatName(id),
            icon: "🍽️",
            category: "Menú Digital",
            status: "Online",
            };
        });

    } catch (error) {
        console.error("Error leyendo menús:", error);
        return [];
    }
}