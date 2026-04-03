import nodemailer from "nodemailer";

import { type AdminRegistrationSubmission } from "@/lib/admin-auth-schema";

const ADMIN_CONFIRMATION_EMAIL = "maisuradzetamazi1@gmail.com";

export class AdminMailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminMailConfigurationError";
  }
}

export async function sendAdminRegistrationConfirmationEmail({
  values,
  confirmationUrl,
}: {
  values: AdminRegistrationSubmission;
  confirmationUrl: string;
}) {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const configuredFrom = process.env.BOOKING_FROM_EMAIL?.trim();

  if (!smtpUser || !smtpPass || smtpPass === "your-app-password") {
    throw new AdminMailConfigurationError("Admin registration email is not configured yet.");
  }

  if (configuredFrom === "your-mailbox@example.com") {
    throw new AdminMailConfigurationError("Admin sender email is not configured yet.");
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const from = configuredFrom || smtpUser;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from,
    to: ADMIN_CONFIRMATION_EMAIL,
    subject: `Admin registration approval required: ${values.username}`,
    text: [
      "A new Castrol Georgia admin registration was submitted.",
      "",
      `Username: ${values.username}`,
      `Email: ${values.email}`,
      "",
      "Activate this admin account by opening the link below:",
      confirmationUrl,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#173322;line-height:1.6">
        <h2 style="margin:0 0 16px;color:#005b2a">Admin registration approval required</h2>
        <p style="margin:0 0 16px">A new Castrol Georgia admin account is waiting for activation.</p>
        <table style="border-collapse:collapse;width:100%;max-width:640px;margin-bottom:18px">
          <tbody>
            ${renderRow("Username", values.username)}
            ${renderRow("Email", values.email)}
          </tbody>
        </table>
        <p style="margin:0 0 12px">Activate the admin account by opening this link:</p>
        <p style="margin:0">
          <a href="${escapeHtml(confirmationUrl)}" style="color:#005b2a;font-weight:700">${escapeHtml(confirmationUrl)}</a>
        </p>
      </div>
    `,
  });
}

function renderRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 12px;border:1px solid #d3dfd5;background:#f4f9f1;font-weight:700">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border:1px solid #d3dfd5">${escapeHtml(value)}</td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
