// app/api/get-payhere-hash/route.js

import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(req) {
  const data = await req.json();
  const { orderId, amount, currency } = data;

  const merchant_id = "1231320";
  const merchant_secret = "NDA5MDU5MjE1OTQyNzU4NTk4Mjk3MTA5MTQ4NDEyNzEzODMyMTc1";

  const formattedAmount = parseFloat(amount)
    .toLocaleString("en-US", { minimumFractionDigits: 2, useGrouping: false });

  const hashedSecret = CryptoJS.MD5(merchant_secret).toString().toUpperCase();

  const rawHash = merchant_id + orderId + formattedAmount + currency + hashedSecret;
  const finalHash = CryptoJS.MD5(rawHash).toString().toUpperCase();

  return NextResponse.json({ hash: finalHash });
}
