import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch the logged-in user's conversion history
export async function GET() {
  try {
    const supabase = await createClient();

    // Check the user's authentication
    const { data: claimsData, error: authError } =
      await supabase.auth.getClaims();

    const userId = claimsData?.claims?.sub;

    if (authError || !userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Fetch only this user's records
    const { data, error } = await supabase
      .from("conversion_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("History fetch error:", error);

      return NextResponse.json(
        { error: "Could not fetch conversion history." },
        { status: 500 }
      );
    }

    return NextResponse.json({ history: data });
  } catch (error) {
    console.error("GET history error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}


// POST: Save a new conversion history record
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: claimsData, error: authError } =
      await supabase.auth.getClaims();

    const userId = claimsData?.claims?.sub;

    if (authError || !userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Read data sent by the frontend
    const body = await request.json();

    const {
      from_currency,
      to_currency,
      amount,
      converted_amount,
      exchange_rate,
    } = body;

    // Validate the values
    if (
      typeof from_currency !== "string" ||
      typeof to_currency !== "string" ||
      typeof amount !== "number" ||
      typeof converted_amount !== "number" ||
      typeof exchange_rate !== "number" ||
      !Number.isFinite(amount) ||
      !Number.isFinite(converted_amount) ||
      !Number.isFinite(exchange_rate) ||
      amount <= 0 ||
      converted_amount < 0 ||
      exchange_rate <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid conversion data." },
        { status: 400 }
      );
    }

    // Insert the conversion into the database
    const { data, error } = await supabase
      .from("conversion_history")
      .insert({
        user_id: userId,
        from_currency: from_currency.toUpperCase(),
        to_currency: to_currency.toUpperCase(),
        amount,
        converted_amount,
        exchange_rate,
      })
      .select()
      .single();

    if (error) {
      console.error("History insert error:", error);

      return NextResponse.json(
        { error: "Failed to save conversion history." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Conversion saved successfully.",
        history: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST history error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}


// DELETE: Delete one history record belonging to the user
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
      await supabase.auth.getClaims();

    const userId = claimsData?.claims?.sub;

    if (authError || !userId) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "History ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("conversion_history")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("History delete error:", error);

      return NextResponse.json(
        { error: "Could not delete history." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "History deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE history error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}