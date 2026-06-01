import fs from "fs";
import path from "path";

const MAX_ITEMS_PER_INDEX = 10;

type SearchItem = {
  id: string;
  name: string;
  file: string;
};

async function buildSearchIndexes(businessPath: string) {
  const categoriesPath = path.join(businessPath, "categorias");
  const searchPath = path.join(businessPath, "search");

  if (!fs.existsSync(searchPath)) {
    fs.mkdirSync(searchPath, { recursive: true });
  }

  const categoryFolders = fs
    .readdirSync(categoriesPath)
    .filter((file) =>
      fs.statSync(path.join(categoriesPath, file)).isDirectory()
    );

  const allItems: SearchItem[] = [];

  for (const category of categoryFolders) {
    const categoryDir = path.join(categoriesPath, category);

    const files = fs
      .readdirSync(categoryDir)
      .filter((f) => f.endsWith(".json"));

    for (const fileName of files) {
      const fullPath = path.join(categoryDir, fileName);

      const raw = fs.readFileSync(fullPath, "utf8");
      const json = JSON.parse(raw);

      const items = Array.isArray(json)
        ? json
        : json.items || [];

      for (const item of items) {
        if (!item.id) {
          console.warn(
            `⚠️ Producto sin id omitido: "${item.name}" en ${fullPath}`
          );
          continue;
        }

        allItems.push({
          id: item.id,
          name: item.name,
          file:
            "/" +
            path
              .relative("public", fullPath)
              .replace(/\\/g, "/"),
        });
      }
    }
  }

  let page = 1;

  for (
    let i = 0;
    i < allItems.length;
    i += MAX_ITEMS_PER_INDEX
  ) {
    const chunk = allItems.slice(
      i,
      i + MAX_ITEMS_PER_INDEX
    );

    const filePath = path.join(
      searchPath,
      `index_${page}.json`
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(chunk, null, 2),
      "utf8"
    );

    page++;
  }

  fs.writeFileSync(
    path.join(searchPath, "meta.json"),
    JSON.stringify(
      {
        total_items: allItems.length,
        total_pages: page - 1,
        items_per_page: MAX_ITEMS_PER_INDEX,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("✅ Search indexes generated");
}

const businessPath = process.argv[2];

if (!businessPath) {
  console.log("❌ Debes pasar la ruta del negocio");
  process.exit(1);
}

buildSearchIndexes(
  path.resolve(process.cwd(), businessPath)
);
// Ejemplo:
// npm run build-search public/menus/la_fogata
//Para ejecutar el script: npm run build-search public/menus/la_fogata
//public/menus/la_fogata se reemplaza con la ubicación del negocio que se quiera indexar
