export const COMPANY_WHATSAPP_NUMBER = '+263 71 354 6242';

export function whatsAppHref(message?: string) {
  const digits = COMPANY_WHATSAPP_NUMBER.replace(/[^\d]/g, '');

  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}
