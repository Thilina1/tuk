import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center p-6">Loading...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
