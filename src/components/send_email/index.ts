"use client";

interface EmailParams {
  tipo: "confirmacion" | "rechazo" | "cancelacion";
  email: string;
  nombre: string;
  nombreEspacio?: string;
  motivo?: string;
  id_registro?: number;
}

export const sendEmailNotification = async ({
  tipo,
  email,
  nombre,
  nombreEspacio,
  motivo,
  id_registro,
}: EmailParams) => {
  const templates = {
    confirmacion: {
      subject: "✅ Tu reserva ha sido confirmada",
      html: `<div style="font-family: Arial, sans-serif;"><h2>¡Hola ${nombre}!</h2><p>Tu reserva en <strong>${nombreEspacio}</strong> ha sido confirmada.</p></div>`,
    },
    rechazo: {
      subject: "❌ Tu reserva ha sido rechazada",
      html: `<div style="font-family: Arial, sans-serif;"><h2>Hola ${nombre}</h2><p>Tu reserva ha sido rechazada. Motivo: ${motivo}</p></div>`,
    },
    cancelacion: {
      subject: "⚠️ Tu reserva ha sido cancelada",
      html: `<div style="font-family: Arial, sans-serif;"><h2>Hola ${nombre}</h2><p>Tu reserva ha sido cancelada por emergencia.</p></div>`,
    },
  };

  try {
    const template = templates[tipo];

    console.log("📨 Enviando email a:", email);

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        subject: template.subject,
        html: template.html,
      }),
    });

    console.log("Respuesta status:", response.status);
    const data = await response.json();
    console.log("Respuesta data:", data);

    if (!response.ok) {
      console.error("Error:", data);
      return false;
    }

    console.log("✅ Email enviado");
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
};
