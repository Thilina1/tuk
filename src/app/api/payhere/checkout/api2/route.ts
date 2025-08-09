import { NextResponse } from "next/server";
import crypto from "node:crypto";

// WebXPay endpoint + enc method flag
const WEBXPAY_ACTION = "https://webxpay.com/index.php?route=checkout/billing";
const ENC_METHOD = "JCs3J+6oSz4V0LgE0zi/Bg==";

// Sandbox public key (OK server-side)
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDurbser5BU/dfw5cVfDun+JuRo
RQRqL6jNeoJrIlR0nPjFcUfU7mYdkw9r3Yeh68PchP/E3SgB1uuED1dIQ3pyPucB
m0sWPCfyDtGAQsq+22nexH/bl1vbEOhfAZ8chLCuzE0DTtrEZZXPPNuIwrdeB8yS
it+/W++K17N6Qh6IPwIDAQAB
-----END PUBLIC KEY-----`;

// Your sandbox merchant + return paths
const MERCHANT_ID = "521577257252";
const RETURN_URL  = "https://www.greentechstartups.com/paymentCopy/thank-you";
const CANCEL_URL  = "https://www.greentechstartups.com/paymentCopy/cancel";
// Optional IPN (set only if configured at WebXPay)
const NOTIFY_URL  = ""; // e.g. "https://your.domain/api/webxpay/ipn"

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");

function rsaEncryptBase64(plaintext: string): string {
  const buf = Buffer.from(plaintext, "utf8");
  const encrypted = crypto.publicEncrypt(
    { key: PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
    buf
  );
  return encrypted.toString("base64");
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Server error";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Inputs from client (with safe defaults)
    const amount = Number(body.amount ?? 1000); // LKR 1000.00
    const currency = String(body.currency ?? "LKR"); // keep same as encrypted amount
    const itemName = String(body.item_name ?? "Regular Tuk Rental");
    const gatewayId = body.payment_gateway_id ? String(body.payment_gateway_id) : ""; // e.g. "1"
    const multipleGatewayIds = body.multiple_payment_gateway_ids ? String(body.multiple_payment_gateway_ids) : ""; // e.g. "1|2|3"

    // Order basics
    const orderId = `TTD-${Date.now()}`;
    const amountStr = amount.toFixed(2); // e.g. "1000.00"

    // "orderId|amount" -> RSA PKCS#1 v1.5 -> base64
    const paymentB64 = rsaEncryptBase64(`${orderId}|${amountStr}`);

    // Custom metadata (returned back to you)
    const customB64 = b64(`${itemName}|${orderId}|${currency}|1`);

    // Build strict payload
    const fields: Record<string, string> = {
      // Required trio
      payment: paymentB64,
      custom_fields: customB64,
      enc_method: ENC_METHOD,

      // Helpful extras (some merchant templates expect these)
      item_name: itemName,
      order_id: orderId,

      // Currency MUST match encrypted amount’s currency
      process_currency: currency,

      // Optional merchant/site context
      cms: "Next.js",
      city: "Colombo",
      state: "Western",
      postal_code: "10300",
      country: "Sri Lanka",

      // Merchant + redirects
      merchant_id: MERCHANT_ID,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
    };

    // Only include if provided/required by your sandbox
    if (NOTIFY_URL) fields.notify_url = NOTIFY_URL;
    if (gatewayId) fields.payment_gateway_id = gatewayId;
    if (multipleGatewayIds) fields.multiple_payment_gateway_ids = multipleGatewayIds;

    return NextResponse.json({
      success: true,
      redirectUrl: WEBXPAY_ACTION,
      fields,
      debug: { orderId, amount: amountStr, currency, gatewayId, multipleGatewayIds },
    });
  } catch (e: unknown) {
    return new NextResponse(errMsg(e), { status: 500 });
  }
}
