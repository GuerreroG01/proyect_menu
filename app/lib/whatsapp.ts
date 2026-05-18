const WHATSAPP_NUMBER = "50586571443";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, me gustaría tener mi negocio en la nube y conocer más información.";

/**
 * @param businessName Nombre opcional del local para personalizar el texto enviado.
 */
export function getHorariosFeriadosWhatsAppUrl(businessName: string = "el local"): string {
  const message = `Hola, me gustaría consultar el horario de atención para los días feriados o especiales en ${businessName}.`;
  return buildWhatsAppUrl(message);
}