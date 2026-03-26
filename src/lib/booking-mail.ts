import nodemailer from "nodemailer";

import { type BookingSubmission, resolveBookingDetails } from "@/lib/booking";

const BOOKING_NOTIFICATION_EMAIL = "currencycarnage@gmail.com";

export class BookingMailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingMailConfigurationError";
  }
}

export async function sendBookingNotification(values: BookingSubmission) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new BookingMailConfigurationError("Booking email is not configured yet. Set SMTP_USER and SMTP_PASS in .env.local.");
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const from = process.env.BOOKING_FROM_EMAIL || smtpUser;
  const details = resolveBookingDetails(values);
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
    to: BOOKING_NOTIFICATION_EMAIL,
    subject: `New Castrol booking: ${values.fullName} / ${details.serviceName}`,
    text: [
      "A new booking request was made from the Castrol Georgia app.",
      "",
      `Name: ${values.fullName}`,
      `Phone: ${values.phone}`,
      `Service center: ${details.centerName}`,
      `Center address: ${details.centerAddress}`,
      `Center phone: ${details.centerPhone}`,
      `Service: ${details.serviceName}`,
      `Preferred product: ${details.preferredProductName}`,
      `Appointment date: ${details.slotDateLabel}`,
      `Appointment time: ${details.slotTimeLabel}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#173322;line-height:1.6">
        <h2 style="margin:0 0 16px;color:#005b2a">New Castrol Georgia booking request</h2>
        <p style="margin:0 0 18px">A user submitted a new service booking from the application.</p>
        <table style="border-collapse:collapse;width:100%;max-width:640px">
          <tbody>
            ${renderRow("Name", values.fullName)}
            ${renderRow("Phone", values.phone)}
            ${renderRow("Service center", details.centerName)}
            ${renderRow("Center address", details.centerAddress)}
            ${renderRow("Center phone", details.centerPhone)}
            ${renderRow("Service", details.serviceName)}
            ${renderRow("Preferred product", details.preferredProductName)}
            ${renderRow("Appointment date", details.slotDateLabel)}
            ${renderRow("Appointment time", details.slotTimeLabel)}
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
