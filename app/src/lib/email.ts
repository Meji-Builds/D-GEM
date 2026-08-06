import nodemailer from "nodemailer";

// No live email provider is configured for this pass. Messages are logged
// to the console instead of actually being sent.
const transporter = nodemailer.createTransport({ jsonTransport: true });

export function ticketEmailHtml(opts: {
  fullName: string;
  ticketId: string;
  qrDataUrl: string;
  eventName: string;
  eventDateLabel: string;
  venue: string;
  kind?: "invitation" | "reminder-7d" | "reminder-1d" | "reminder-morning";
}) {
  const subjectLine =
    opts.kind && opts.kind !== "invitation"
      ? "Reminder: your D-GEM ticket"
      : `Your invitation to ${opts.eventName}`;
  return `<!doctype html>
<html>
<body style="margin:0;background:#f0eee9;font-family:Archivo,Arial,sans-serif;color:#141210;">
  <div style="max-width:420px;margin:24px auto;background:#fff;border:2px solid #141210;">
    <div style="padding:14px 18px;background:#141210;">
      <span style="display:inline-flex;align-items:center;gap:6px;background:none;color:#fff;font-weight:800;font-size:16px;letter-spacing:.04em;">D<span style="color:#C9A227;">GEM</span></span>
    </div>
    <div style="padding:20px 18px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:10px;">${subjectLine}</div>
      <p style="font-size:13px;line-height:1.6;color:#5a564f;">Hi ${opts.fullName}, present this QR code at the gate to be scanned in.</p>
      <img src="${opts.qrDataUrl}" width="140" height="140" alt="QR ticket" style="display:block;margin:14px 0;border:2px solid #141210;" />
      <p style="font-size:12px;color:#94908a;line-height:1.8;">
        Ticket ID · ${opts.ticketId}<br/>
        ${opts.eventDateLabel} · ${opts.venue}
      </p>
      <a href="/my-ticket?ticketId=${encodeURIComponent(opts.ticketId)}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#141210;color:#fff;font-weight:700;font-size:11px;text-decoration:none;letter-spacing:.04em;">View my ticket →</a>
    </div>
  </div>
</body>
</html>`;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const info = await transporter.sendMail({
    from: `"D-GEM Conference 1.0" <no-reply@dgem.local>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  // eslint-disable-next-line no-console
  console.log(`[email:stub] sent to=${opts.to} subject="${opts.subject}"`, info.messageId);
  return info;
}
