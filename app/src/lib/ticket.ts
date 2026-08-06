import QRCode from "qrcode";

export function generateTicketId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `DGEM-1.0-${n}`;
}

export async function ticketQrDataUrl(ticketId: string) {
  return QRCode.toDataURL(ticketId, {
    margin: 1,
    width: 320,
    color: { dark: "#141210", light: "#ffffff" },
  });
}
