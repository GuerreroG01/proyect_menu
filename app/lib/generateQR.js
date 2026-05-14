import QRCode from "qrcode";

QRCode.toDataURL("https://tudominio.com/la-fogata")
  .then(url => {
    console.log(url); // imagen QR base64
  });