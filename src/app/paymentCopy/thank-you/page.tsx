import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Thank You for Your Booking!</h1>
        <p>Your TukTuk rental is confirmed. Check your email at test@tuktukdrive.com for details.</p>
        <Link href="/" className="text-blue-600">Return to Home</Link>
      </div>
    </div>
  );
}