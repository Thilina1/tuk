import { NextResponse } from "next/server";

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
      console.error("Amount must be greater than 1 USD");
      return NextResponse.json(
        { error: "Amount must be greater than 1 USD" },
        { status: 400 }
      );
    }

    // Add WebXPay credentials and fixed fields (hardcoded for testing)
    const webXPayData = {
      api_username: "ZCjaVcSHYe",
      api_password: "pVb5FOf07y",
      secret_key: "8a0e4a29-194c-454a-926d-ecdcbd46adb2",
      payment_gateway_id: "15", // Replace with correct ID from WebXPay dashboard
      response_url: "https://greentechstartups.com/thank-you",
      cancel_url: "https://greentechstartups.com/cancel",
      ...paymentData,
    };

    // WebXPay sandbox endpoint
    const webXPayUrl = "https://webxpay.com/index.php?route=checkout/billing"; // Verify with WebXPay

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
