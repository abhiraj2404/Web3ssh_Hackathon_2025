import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get("walletAddress");
  const userId = searchParams.get("id");

  if (userId) {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(user);
  } else if (walletAddress) {
    const { data: user, error } = await supabase.from("users").select("*").eq("walletAddress", walletAddress).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ error: "walletAddress or id is required" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { walletAddress, name, email } = body;
  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
  }
  const { data: user, error } = await supabase.from("users").insert({ walletAddress, name, email }).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(user);
}
