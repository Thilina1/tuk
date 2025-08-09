import { NextResponse } from "next/server";
import crypto from "node:crypto";

// --------------------------
// 🔒 Sandbox secrets inline (server-only)
// --------------------------
const WEBXPAY_ACTION = "https://webxpay.com/index.php?route=checkout/billing";
const ENC_METHOD = "JCs3J+6oSz4V0LgE0zi/Bg==";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDurbser5BU/dfw5cVfDun+JuRo
RQRqL6jNeoJrIlR0nPjFcUfU7mYdkw9r3Yeh68PchP/E3SgB1uuED1dIQ3pyPucB
m0sWPCfyDtGAQsq+22nexH/bl1vbEOhfAZ8chLCuzE0DTtrEZZXPPNuIwrdeB8yS
it+/W++K17N6Qh6IPwIDAQAB
-----END PUBLIC KEY-----`;

const SANDBOX_SECRET_KEY = "8a0e4a29-194c-454a-926d-ecdcbd46adb2";
const SANDBOX_API_USERNAME = "ZCjaVcSHYe";
const SANDBOX_API_PASSWORD = "pVb5FOf07y";

// Optional
const MERCHANT_ID = "521577257252";
const RETURN_URL = "https://www.greentechstartups.com/paymentCopy/thank-you";
const CANCEL_URL = "https://www.greentechstartups.com/paymentCopy/cancel";
const NOTIFY_URL = ""; // leave empty if not using

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");

function rsaEncryptBase64(plaintext: string): string {
  const buf = Buffer.from(plaintext, "utf8");
  const encrypted = crypto.publicEncrypt(
    { key: PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
    buf
  );
  return encrypted.toString("base64");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount ?? 12.0);
    const currency = String(body.currency ?? "LKR");
    const meta = body.meta ?? {};

    const uniqueOrderId = `TTD-${Date.now()}`;
    const amountStr = amount.toFixed(2);

    // "orderId|amount" -> RSA PKCS#1 v1.5 -> base64
    const paymentB64 = rsaEncryptBase64(`${uniqueOrderId}|${amountStr}`);

    // Optional: compute signature with SANDBOX_SECRET_KEY if the spec requires
    // const signature = crypto.createHmac("sha256", SANDBOX_SECRET_KEY).update(...).digest("hex");

    const customRaw = `${meta.item ?? "Regular Tuk Rental"}|${uniqueOrderId}|${currency}|1`;
    const customB64 = b64(customRaw);

    // Build strict Record<string,string>, then add optionals safely
    const fields: Record<string, string> = {
      payment: paymentB64,
      custom_fields: customB64,
      enc_method: ENC_METHOD,
      process_currency: currency,
      cms: "Next.js",
      city: "Colombo",
      state: "Western",
      postal_code: "10300",
      country: "Sri Lanka",
    };

    if (MERCHANT_ID) fields.merchant_id = MERCHANT_ID;
    if (RETURN_URL) fields.return_url = RETURN_URL;
    if (CANCEL_URL) fields.cancel_url = CANCEL_URL;
    if (NOTIFY_URL) fields.notify_url = NOTIFY_URL;

    // If a REST call with API creds is needed, do it here server-side using fetch()
    // with SANDBOX_API_USERNAME / SANDBOX_API_PASSWORD / SANDBOX_SECRET_KEY.

    return NextResponse.json({
      success: true,
      redirectUrl: WEBXPAY_ACTION,
      fields,
      debug: { orderId: uniqueOrderId, amount: amountStr },
    });
  } catch (e: any) {
    return new NextResponse(e?.message || "Server error", { status: 500 });
  }
}
