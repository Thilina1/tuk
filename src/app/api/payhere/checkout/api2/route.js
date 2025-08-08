"use client";

export function initiateWebXPayPayment(paymentData) {
  const webXPayUrl = "https://webxpay.com/index.php?route=checkout/billing"; // Sandbox checkout endpoint (verify with WebXPay)

  // Create form for payment submission
  const form = document.createElement("form");
  form.method = "POST";
  form.action = webXPayUrl;

  for (const key in paymentData) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = paymentData[key];
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
