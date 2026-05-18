const WHATSAPP_NUMBER = "50586571443";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, me gustaría tener mi negocio en la nube y conocer más información.";