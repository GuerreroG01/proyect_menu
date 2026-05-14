import QRCode from "qrcode";
import fs from "fs";

const restaurants = [
    "la-fogata",
    "asados-juan"
];

restaurants.forEach(async (slug) => {
    const url = `https://tudominio.com/${slug}`;

    await QRCode.toFile(
        `public/qr/${slug}.png`,
        url,
        {
        width: 300,
        margin: 2
        }
    );

    console.log(`QR generado: ${slug}`);
});