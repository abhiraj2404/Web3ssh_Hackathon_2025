import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/events?userId=... or /api/events?id=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const eventId = searchParams.get("id");

  let query = supabase.from("events").select("*");
  if (eventId) {
    query = query.eq("id", eventId);
  } else if (userId) {
    query = query.eq("creator_id", userId);
  } else {
    query = query.order("date", { ascending: true });
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // If eventId, return single event (or null)
  if (eventId) {
    return NextResponse.json(data && data.length > 0 ? data[0] : null);
  }
  return NextResponse.json(data);
}

// POST /api/events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Validate required fields
    const requiredFields = ["title", "date", "creator_id"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    const { data, error } = await supabase.from("events").insert([body]).select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
