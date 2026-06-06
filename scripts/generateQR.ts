const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const url = process.argv[2];
const logoPath = path.join(__dirname, "../assets/image.jpg");// Agrega imagen al centro del qr

if (!url) {
  console.error("❌ Debes pasar una URL como parámetro");
  console.log('Ejemplo: node scripts/generate-qr.js "https://miweb.com/restaurante"');
  process.exit(1);
}

async function generateQR() {
  try {
    const outputDir = path.join(__dirname, "../public/qrs");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = url
      .replace(/^https?:\/\//, "")
      .replace(/[^\w]/g, "_")
      .slice(0, 50);

    const filePath = path.join(outputDir, `${fileName}.png`);

    // 1. Generar QR base (alta corrección de error para soportar logo)
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: "H", // importante para permitir logo
      margin: 3,
      width: 600,
      color: {
        dark: "#002B5B",
        light: "#FFFFFF",
      },
    });

    // 2. Procesar logo (más pequeño + safe zone)
    const logo = await sharp(logoPath)
      .resize(90, 90, {
        fit: "contain",
        background: "#FFFFFF",
      })
      .extend({
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
        background: "#FFFFFF",
      })
      .png()
      .toBuffer();

    // 3. Componer QR + logo centrado
    const finalImage = await sharp(qrBuffer)
      .composite([
        {
          input: logo,
          gravity: "center",
        },
      ])
      .png()
      .toBuffer();

    // 4. Guardar archivo
    fs.writeFileSync(filePath, finalImage);

    console.log("✅ QR con logo generado correctamente");
    console.log("📁 Archivo:", filePath);
    console.log("🔗 URL:", url);
  } catch (error) {
    console.error("❌ Error generando QR:", error);
  }
}

generateQR();