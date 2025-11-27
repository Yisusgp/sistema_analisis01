import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, subject, html } = body;

    console.log("📧 Email a enviar:", email);
    console.log("API Key existe:", !!process.env.RESEND_API_KEY);

    if (!email || !subject || !html) {
      return Response.json(
        { error: "Faltan campos (email, subject, html)" },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        { error: "RESEND_API_KEY no configurado" },
        { status: 500 },
      );
    }

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Cambia esto a tu dominio verificado después
      to: email,
      subject,
      html,
    });

    if (response.error) {
      console.error("Error Resend:", response.error);
      return Response.json(
        { error: response.error.message },
        { status: 400 },
      );
    }

    console.log("✅ Email enviado:", response.data);
    return Response.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Error en API:", error);
    return Response.json(
      { error: error.message },
      { status: 500 },
    );
  }
}
