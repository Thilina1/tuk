import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { db } from "@/config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { amount, name, email, phone, currency = "USD" } = data;

    // 🔒 Use inline secrets for testing only
    const merchant_id = "1231320";
    const merchant_secret = "MjE4OTI2OTczOTM3MjY5NjM0MzA0MTkxNzI5NTY2MjE0NjA3NDMwNg==";

    // ✅ Basic validation
    if (!amount || isNaN(amount) || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const order_id = `ORDER-${Date.now()}`;
    const amountFormatted = parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      useGrouping: false,
    });

    const hashedSecret = CryptoJS.MD5(merchant_secret).toString().toUpperCase();
    const rawHash = merchant_id + order_id + amountFormatted + currency + hashedSecret;
    const hash = CryptoJS.MD5(rawHash).toString().toUpperCase();

    // ✅ Store in Firestore
    const ref = doc(collection(db, "payments"), order_id);
    await setDoc(ref, {
      order_id,
      amount: parseFloat(amount),
      currency,
      customer: {
        name,
        email,
        phone,
        address: "Matale",
        city: "Matale",
        country: "Sri Lanka",
      },
      payment_hash: hash,
      status: "PENDING",
      timestamp: new Date().toISOString(),
    });

    // ✅ Return PayHere HTML form
    const htmlForm = `
      <form id="payhere_form" method="post" action="https://sandbox.payhere.lk/pay/checkout">
        <input type="hidden" name="merchant_id" value="${merchant_id}" />
        <input type="hidden" name="return_url" value="https://tuktukdrive.com/payment-success" />
        <input type="hidden" name="cancel_url" value="https://tuktukdrive.com/payment-cancel" />
        <input type="hidden" name="notify_url" value="https://tuktukdrive.com/api/payhere/notify" />
        <input type="hidden" name="order_id" value="${order_id}" />
        <input type="hidden" name="items" value="Tuk Tuk Rental" />
        <input type="hidden" name="amount" value="${amountFormatted}" />
        <input type="hidden" name="currency" value="${currency}" />
        <input type="hidden" name="first_name" value="${name}" />
        <input type="hidden" name="last_name" value="" />
        <input type="hidden" name="email" value="${email}" />
        <input type="hidden" name="phone" value="${phone}" />
        <input type="hidden" name="address" value="Matale" />
        <input type="hidden" name="city" value="Matale" />
        <input type="hidden" name="country" value="Sri Lanka" />
        <input type="hidden" name="hash" value="${hash}" />
      </form>
      <script>
        (() => {
          const form = document.getElementById('payhere_form');
          if (form) form.submit();
        })();
      </script>
    `;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    return new NextResponse(htmlForm, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("🔥 Error generating PayHere form:", err);
    return NextResponse.json(
      { error: "Something went wrong generating the payment form." },
      { status: 500 }
    );
  }
}
