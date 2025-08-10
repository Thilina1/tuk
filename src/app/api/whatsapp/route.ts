// app/api/whatsapp/send/route.ts or route.js
import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

type Payload = {
  to?: string | string[];
  template: string;
  langCode?: string;
  components?: unknown[];
};

function normalize(msisdn: string) {
  const digits = msisdn.replace(/[^\d]/g, "");
  return digits.startsWith("0") ? `94${digits.slice(1)}` : digits;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // Fetch settings
    const snap = await getDoc(doc(db, "settings", "contact"));
    if (!snap.exists()) {
      return NextResponse.json({ error: "Admin settings not found" }, { status: 404 });
    }
    const cfg = snap.data() as {
      whatsappToken?: string;
      whatsappPhoneId?: string;
      whatsappGraphVersion?: string;
      whatsappNumber?: string; // optional default notify
    };

    const TOKEN = cfg.whatsappToken;
    const PHONE_ID = cfg.whatsappPhoneId;
    const GRAPH = cfg.whatsappGraphVersion || "v22.0";

    if (!TOKEN || !PHONE_ID) {
      return NextResponse.json(
        { error: "WhatsApp token or phone id missing in settings" },
        { status: 400 }
      );
    }

    const url = `https://graph.facebook.com/${GRAPH}/${PHONE_ID}/messages`;
    const lang = body.langCode || "en_US";

    // default notify recipient (optional)
    const targets = cfg.whatsappNumber ? [cfg.whatsappNumber] : [];

    if (body.to) {
      const arr = Array.isArray(body.to) ? body.to : [body.to];
      targets.push(...arr);
    }

    const uniqueTargets = [...new Set(targets.map(normalize))];
    if (uniqueTargets.length === 0) {
      return NextResponse.json({ error: "No recipients provided" }, { status: 400 });
    }

    const results: any[] = [];
    for (const to of uniqueTargets) {
      const payload = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: body.template,
          language: { code: lang },
          ...(body.components ? { components: body.components } : {}),
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      results.push({ to, ok: res.ok, data: json });
    }

    const anyFailed = results.some((r) => !r.ok);
    return NextResponse.json({ results }, { status: anyFailed ? 207 : 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}
