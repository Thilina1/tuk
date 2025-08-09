// app/api/whatsapp/send/route.ts
// NOTE: You inlined secrets for testing on purpose. Remove HARDCODED_TOKEN before prod.

export const runtime = "nodejs";

// Define a type for WhatsApp template components
type Component = {
  type: "header" | "body" | "button"; // Common component types
  parameters?: Array<{
    type: "text" | "image" | "video" | "document" | "currency" | "date_time";
    [key: string]: any; // Allow specific parameter fields (e.g., text, image.url)
  }>;
  // Add more specific fields as needed based on your templates
};

type TemplatePayload = {
  name: string;            // e.g. "hello_world" or your template name
  language: string;        // e.g. "en_US" or "en"
  components?: Component[]; // Use specific Component type
};

export async function POST(req: Request) {
  try {
    const {
      to,                    // E.164 digits only, e.g. "94711650060"
      text,                  // optional (free-form session text)
      template,              // optional (to send template)
      // For testing, we hardcode these; you can still override from client if needed.
      phoneNumberId,
      apiVersion,
      tokenOverride,
    }: {
      to: string;
      text?: string;
      template?: TemplatePayload;
      phoneNumberId?: string;
      apiVersion?: string;
      tokenOverride?: string;
    } = await req.json();

    if (!to) {
      return new Response(JSON.stringify({ error: "Missing 'to' number" }), { status: 400 });
    }

    // 🔒 Inlined for TESTING ONLY — replace with env vars in prod
    const HARDCODED_PHONE_NUMBER_ID = "770899736101213";
    const HARDCODED_TOKEN =
      "EAAULJhn5aFEBPNn2nhqUYZCwBguVdZAa1sWL4cuAcSIezQShN0qPziZC9qpNkhAduijJnJ6oZC1yP1E1Vw3VGBECCk8ufiUaqH2P5XxGkmod12iYhU6AmnrDxFU3VBA15LBJVDIZCWtTU7VdBUD4A0lNz5LrzZBmXZBZAB0fSoYcHCeH9BHZAkR20YnLBulkA47nNUh7kRk0R9PJdELXQSjvAh20NL8xLc445ZAi1kZCoEqml5s0p8x9QEQakiZBGUxh1gZDZD";

    const WABA_PHONE_ID = phoneNumberId || HARDCODED_PHONE_NUMBER_ID;
    const API_VERSION = apiVersion || "v22.0";
    const TOKEN = tokenOverride || HARDCODED_TOKEN;

    const url = `https://graph.facebook.com/${API_VERSION}/${WABA_PHONE_ID}/messages`;

    const body =
      template
        ? {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
              name: template.name,
              language: { code: template.language },
              ...(template.components ? { components: template.components } : {}),
            },
          }
        : {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: text || "", preview_url: true },
          };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Surface real Graph errors to the client
    if (!res.ok) {
      return new Response(JSON.stringify({ status: res.status, error: data }), { status: res.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}