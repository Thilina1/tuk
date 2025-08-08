import Link from "next/link";

export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Payment Canceled</h1>
        <p>Something went wrong. Please try again or contact us at info@tuktukdrive.com.</p>
        <Link href="/pricing" className="text-blue-600">Try Again</Link>
      </div>
    </div>
  );
}