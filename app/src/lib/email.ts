import { Resend } from "resend";
import { getSiteUrl } from "./siteUrl";

type Attachment = { filename: string; content: string; contentId?: string; contentType?: string };

// Converts a QR "data:image/png;base64,...." URL into an inline (cid:) email
// attachment. Most mail clients (Gmail, Outlook) strip <img src="data:..."> —
// embedding the same image as a Content-ID attachment is the version that
// actually renders.
export function qrAttachment(dataUrl: string, contentId = "qrcode"): Attachment {
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  return { filename: "qr.png", content: base64, contentId, contentType: "image/png" };
}

export function ticketEmailHtml(opts: {
  fullName: string;
  ticketId: string;
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
      <img src="cid:qrcode" width="140" height="140" alt="QR ticket" style="display:block;margin:14px 0;border:2px solid #141210;" />
      <p style="font-size:12px;color:#94908a;line-height:1.8;">
        Ticket ID · ${opts.ticketId}<br/>
        ${opts.eventDateLabel} · ${opts.venue}
      </p>
      <a href="${getSiteUrl()}/my-ticket?ticketId=${encodeURIComponent(opts.ticketId)}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#141210;color:#fff;font-weight:700;font-size:11px;text-decoration:none;letter-spacing:.04em;">View my ticket →</a>
    </div>
  </div>
</body>
</html>`;
}

export function volunteerAcceptedEmailHtml(opts: {
  fullName: string;
  role: string;
  crewId: string;
  eventName: string;
  eventDateLabel: string;
  venue: string;
}) {
  return `<!doctype html>
<html>
<body style="margin:0;background:#f0eee9;font-family:Archivo,Arial,sans-serif;color:#141210;">
  <div style="max-width:420px;margin:24px auto;background:#fff;border:2px solid #141210;">
    <div style="padding:14px 18px;background:#141210;">
      <span style="display:inline-flex;align-items:center;gap:6px;background:none;color:#fff;font-weight:800;font-size:16px;letter-spacing:.04em;">D<span style="color:#C9A227;">GEM</span></span>
    </div>
    <div style="padding:20px 18px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:10px;">You're on the crew.</div>
      <p style="font-size:13px;line-height:1.6;color:#5a564f;">
        Hi ${opts.fullName}, you're confirmed as <strong>${opts.role}</strong> for ${opts.eventName}. Show this badge at
        accreditation on event day — the same QR code gets you crew access.
      </p>
      <img src="cid:qrcode" width="140" height="140" alt="Crew QR badge" style="display:block;margin:14px 0;border:2px solid #141210;" />
      <p style="font-size:12px;color:#94908a;line-height:1.8;">
        Crew ID · ${opts.crewId}<br/>
        Role · ${opts.role}<br/>
        ${opts.eventDateLabel} · ${opts.venue}
      </p>
      <a href="${getSiteUrl()}/crew/${opts.crewId}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#141210;color:#fff;font-weight:700;font-size:11px;text-decoration:none;letter-spacing:.04em;">View my badge →</a>
    </div>
  </div>
</body>
</html>`;
}

const FROM_ADDRESS = process.env.EMAIL_FROM || "D-GEM Conference 1.0 <onboarding@resend.dev>";

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}) {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      attachments: opts.attachments,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error(`[email] failed to send to=${opts.to} subject="${opts.subject}"`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    // eslint-disable-next-line no-console
    console.log(`[email] sent to=${opts.to} subject="${opts.subject}" id=${data?.id}`);
    return data;
  }

  // No live email provider is configured for this pass. Messages are logged
  // to the console instead of actually being sent.
  // eslint-disable-next-line no-console
  console.log(`[email:stub] not sent (RESEND_API_KEY unset) to=${opts.to} subject="${opts.subject}"`);
  return null;
}
