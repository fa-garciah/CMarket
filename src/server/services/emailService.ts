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
      <body style="margin:0;padding:0;background-color:#0f0d1a;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0d1a;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:linear-gradient(145deg,#17142b 0%,#241d3d 45%,#161126 100%);border-radius:24px;border:1px solid rgba(255,255,255,0.12);overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="padding:32px 36px 0 36px;">
                    <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(199,210,254,0.7);">CMARKET</p>
                    <h1 style="margin:0;font-size:28px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">Verifica tu cuenta</h1>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:20px 36px 0 36px;">
                    <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:24px 36px;">
                    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:24px;">
                      <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(199,210,254,0.7);">Bienvenido</p>
                      <p style="margin:0 0 16px 0;font-size:16px;font-weight:600;color:#ffffff;">Hola, gracias por registrarte.</p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(226,232,240,0.9);">Haz clic en el botón para confirmar tu dirección de correo y activar tu cuenta en CMarket.</p>
                    </div>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding:0 36px 32px 36px;">
                    <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#6d5fd4 0%,#4f46e5 100%);color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 8px 24px rgba(79,70,229,0.35);">
                      Verificar cuenta
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:0 36px 28px 36px;">
                    <div style="height:1px;background:rgba(255,255,255,0.08);margin-bottom:20px;"></div>
                    <p style="margin:0;font-size:12px;color:rgba(148,163,184,0.7);line-height:1.6;">Este link expira en 24 horas. Si no creaste una cuenta en CMarket, puedes ignorar este correo.</p>
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
