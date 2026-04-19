import nodemailer from "nodemailer";

import { type RegistrationSubmission } from "@/lib/registration";

const REGISTRATION_NOTIFICATION_EMAIL = "currencycarnage@gmail.com";

export class RegistrationMailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationMailConfigurationError";
  }
}

export async function sendRegistrationNotification(values: RegistrationSubmission) {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const configuredFrom = process.env.BOOKING_FROM_EMAIL?.trim();

  if (!smtpUser || !smtpPass || smtpPass === "your-app-password") {
    throw new RegistrationMailConfigurationError("Registration email is not configured yet.");
  }

  if (configuredFrom === "your-mailbox@example.com") {
    throw new RegistrationMailConfigurationError("Registration sender email is not configured yet.");
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

  const roleLabel = values.role === "affiliate" ? "Affiliate" : "Client";

  await transporter.sendMail({
    from,
    to: REGISTRATION_NOTIFICATION_EMAIL,
    subject: `New Castrol registration: ${roleLabel} / ${values.username}`,
    text: [
      "A new Castrol Georgia registration request was submitted.",
      "",
      `Role: ${roleLabel}`,
      `Username: ${values.username}`,
      `Email: ${values.email}`,
      `Password: ${values.password}`,
      ...(values.role === "affiliate"
        ? [
            `Service name: ${values.serviceName}`,
            `Address: ${values.address}`,
            `Phone number: ${values.phone}`,
            `Coordinates: ${values.latitude}, ${values.longitude}`,
            "",
            "Affiliate registrations should be reviewed and approved by the admin profile.",
          ]
        : []),
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#173322;line-height:1.6">
        <h2 style="margin:0 0 16px;color:#005b2a">New Castrol Georgia registration request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:640px">
          <tbody>
            ${renderRow("Role", roleLabel)}
            ${renderRow("Username", values.username)}
            ${renderRow("Email", values.email)}
            ${renderRow("Password", values.password)}
            ${
              values.role === "affiliate"
                ? [
                    renderRow("Service name", values.serviceName),
                    renderRow("Address", values.address),
                    renderRow("Phone number", values.phone),
                    renderRow("Coordinates", `${values.latitude}, ${values.longitude}`),
                  ].join("")
                : ""
            }
          </tbody>
        </table>
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
