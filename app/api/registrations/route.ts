import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/registrations?eventId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }
  const { data, error } = await supabase.from("registrations").select("*").eq("event_id", eventId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/registrations
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, event_id, socials, email, metadata } = body;
    if (!user_id || !event_id) {
      return NextResponse.json({ error: "user_id and event_id are required" }, { status: 400 });
    }
    const { data, error } = await supabase.from("registrations").insert([{ user_id, event_id, socials, email, metadata }]).select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
