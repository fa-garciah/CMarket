import { Resend } from "resend";

export async function sendVerificationEmail(correo: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error(
      "Falta NEXTAUTH_URL, AUTH_URL o NEXT_PUBLIC_APP_URL para construir el link de verificacion",
    );
  }

  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "CMarket <onboarding@anahuarket.cosmic-chimps.com>",
    to: correo,
    subject: "Verifica tu cuenta de CMarket",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <body style="margin:0;padding:0;background-color:#ffffff;font-family:ui-sans-serif,system-ui,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:48px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

                <!-- Logo / Title -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <span style="font-size:28px;font-weight:700;color:#7c3aed;letter-spacing:-0.5px;">CMarket</span>
                  </td>
                </tr>

                <!-- Card -->
                <tr>
                  <td style="background-color:#f3f4f6;border-radius:16px;padding:36px;">

                    <!-- Card content -->
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#7c3aed;">Verificación de cuenta</p>
                    <h1 style="margin:8px 0 16px 0;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">Verifica tu correo</h1>
                    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.6;color:#6b7280;">
                      Gracias por registrarte en CMarket. Haz clic en el botón para confirmar tu dirección de correo y activar tu cuenta.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${verifyUrl}" style="display:inline-block;background-color:#7c3aed;color:#ffffff;padding:13px 36px;border-radius:9999px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
                            Verificar cuenta
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height:1px;background-color:#e5e7eb;margin:28px 0;"></div>

                    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                      Este link expira en 24 horas. Si no creaste una cuenta en CMarket, puedes ignorar este correo.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top:24px;">
                    <p style="margin:0;font-size:12px;color:#d1d5db;">© 2026 CMarket · Universidad Anáhuac Cancún</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}
