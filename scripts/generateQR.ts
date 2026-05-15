const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const url = process.argv[2];

if (!url) {
  console.error("❌ Debes pasar una URL como parámetro");
  console.log("Ejemplo:");
  console.log('node scripts/generate-qr.js "https://miweb.com/restaurante"');
  process.exit(1);
}

async function generateQR() {
  try {
    const outputDir = path.join(__dirname, "../public/qrs");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // nombre de archivo seguro
    const fileName = url
      .replace(/^https?:\/\//, "")
      .replace(/[^\w]/g, "_")
      .slice(0, 50);

    const filePath = path.join(outputDir, `${fileName}.png`);

    await QRCode.toFile(filePath, url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
      color: {
        dark: "#002B5B",
        light: "#FFFFFF",
      },
    });

    console.log("✅ QR generado correctamente");
    console.log("📁 Archivo:", filePath);
    console.log("🔗 URL:", url);
  } catch (error) {
    console.error("❌ Error generando QR:", error);
  }
}

generateQR();