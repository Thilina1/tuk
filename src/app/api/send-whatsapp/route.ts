export async function POST(req: Request) {
  try {
    const { to, text } = await req.json();
    if (!to || !text) {
      return new Response(JSON.stringify({ error: "Missing to/text" }), { status: 400 });
    }

    const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `EAAULJhn5aFEBPNn2nhqUYZCwBguVdZAa1sWL4cuAcSIezQShN0qPziZC9qpNkhAduijJnJ6oZC1yP1E1Vw3VGBECCk8ufiUaqH2P5XxGkmod12iYhU6AmnrDxFU3VBA15LBJVDIZCWtTU7VdBUD4A0lNz5LrzZBmXZBZAB0fSoYcHCeH9BHZAkR20YnLBulkA47nNUh7kRk0R9PJdELXQSjvAh20NL8xLc445ZAi1kZCoEqml5s0p8x9QEQakiZBGUxh1gZDZD`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to, // E.164 digits e.g. "9476XXXXXXX"
        type: "text",
        text: { body: text, preview_url: true },
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.ok ? 200 : 500 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}