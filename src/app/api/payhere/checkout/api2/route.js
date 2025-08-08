
import { NextResponse } from "next/server";
import JSEncrypt from "jsencrypt";

export async function POST(request) {
  try {
    const paymentData = await request.json();

    // Validate required fields
    const requiredFields = [
      "amount",
      "currency",
      "item_name",
      "first_name",
      "last_name",
      "email",
      "contact_number",
    ];
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate amount
    if (paymentData.amount <= 1) {
      console.error("Amount must be greater than 1 USD or LKR");
      return NextResponse.json(
        { error: "Amount must be greater than 1 USD or LKR" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `TUK${Date.now()}`;

    // Encrypt payment field (unique_order_id|total_amount)
    const plaintext = `${orderId}|${(paymentData.amount * 100).toFixed(0)}`; // Convert to cents
    const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDurbser5BU/dfw5cVfDun+JuRo
RQRqL6jNeoJrIlR0nPjFcUfU7mYdkw9r3Yeh68PchP/E3SgB1uuED1dIQ3pyPucB
m0sWPCfyDtGAQsq+22nexH/bl1vbEOhfAZ8chLCuzE0DTtrEZZXPPNuIwrdeB8yS
it+/W++K17N6Qh6IPwIDAQAB
-----END PUBLIC KEY-----`;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedPayment = encrypt.encrypt(plaintext);
    if (!encryptedPayment) {
      console.error("Encryption failed");
      return NextResponse.json(
        { error: "Failed to encrypt payment data" },
        { status: 500 }
      );
    }
    const payment = Buffer.from(encryptedPayment).toString("base64");

    // Encode custom fields
    const customFields = Buffer.from("cus_1|cus_2|cus_3|cus_4").toString("base64");

    // Add WebXPay credentials and fields (hardcoded for testing)
    const webXPayData = {
      api_username: "ZCjaVcSHYe",
      api_password: "pVb5FOf07y",
      secret_key: "8a0e4a29-194c-454a-926d-ecdcbd46adb2",
      payment_gateway_id: "15", // REPLACE WITH CORRECT ID FROM WEBXPAY SUPPORT
      multiple_payment_gateway_ids: "", // Optional: Add pipe-separated IDs if needed
      response_url: "https://greentechstartups.com/thank-you",
      cancel_url: "https://greentechstartups.com/cancel",
      order_id: orderId,
      payment: payment,
      custom_fields: customFields,
      enc_method: "JCs3J+6oSz4V0LgE0zi/Bg==",
      cms: "nextjs",
      address_line_one: "123 Test Street",
      address_line_two: "",
      city: "Colombo",
      state: "Western",
      postal_code: "10350",
      country: "LK",
      process_currency: paymentData.currency,
      ...paymentData,
    };

    // WebXPay sandbox endpoint
    const webXPayUrl = "https://webxpay.com/index.php?route=checkout/billing";

    // Return form data for client-side submission
    return NextResponse.json({
      success: true,
      redirectUrl: webXPayUrl,
      paymentData: webXPayData,
    }, { status: 200 });
  } catch (error) {
    console.error("Error in WebXPay checkout:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
