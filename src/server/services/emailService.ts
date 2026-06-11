import { Resend } from "resend"

export async function sendVerificationEmail(correo: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`

  await resend.emails.send({
    from: "CMarket <onboarding@anahuarket.cosmic-chimps.com>",
    to: "correo",
    subject: "Verifica tu cuenta de CMarket",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #FF6B00;">CMARKET</h1>
        <p>Hola, gracias por registrarte.</p>
        <p>Haz click en el botón para verificar tu cuenta:</p>
        <a href="${verifyUrl}" style="
          display: inline-block;
          background: #FF6B00;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        ">
          VERIFICAR CUENTA
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Este link expira en 24 horas.
        </p>
      </div>
    `
  })
}