export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  WHATSAPP_VERIFY_TOKEN?: string;
  WHATSAPP_API_TOKEN?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "healthy", engine: "CureSlot Edge", env: env.ENVIRONMENT }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Meta WhatsApp Webhook Verification
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === (env.WHATSAPP_VERIFY_TOKEN || "cureslot_token")) {
        return new Response(challenge, { status: 200 });
      }
      return new Response("Forbidden", { status: 403 });
    }

    // WhatsApp Inbound Message Handler
    if (request.method === "POST" && url.pathname === "/webhook") {
      try {
        const payload: any = await request.json();
        const entry = payload?.entry?.[0]?.changes?.[0]?.value;
        const message = entry?.messages?.[0];

        if (message) {
          const from = message.from;
          const text = message.text?.body || "";

          // Fast D1 edge query: lookup or stage appointment
          const appointmentId = crypto.randomUUID();
          await env.DB.prepare(
            "INSERT INTO appointments (id, clinic_id, patient_phone, slot_time, status) VALUES (?, ?, ?, datetime('now', '+1 day'), 'QUEUED')"
          )
            .bind(appointmentId, "default_clinic", from)
            .run();

          return new Response(JSON.stringify({ success: true, appointmentId }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }

      return new Response("EVENT_RECEIVED", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
};
