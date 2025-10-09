// app/api/google-reviews/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const GOOGLE_API_KEY = "AIzaSyB9j0PkBBqTQkOD0M76-YuuILVlJmtWOXg";
  const PLACE_ID = "ChIJBaqwbTSeYiwRL5bFDiOiUBY";

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${GOOGLE_API_KEY}`
    );
    const data = await res.json();

    if (!data.result?.reviews) {
      return NextResponse.json({ error: "No reviews found" }, { status: 404 });
    }

    return NextResponse.json(data.result.reviews);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch reviews ", err}, { status: 500 });
  }
}
