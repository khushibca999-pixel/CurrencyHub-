import { NextResponse } from "next/server";

// Frankfurter's endpoint for supported currencies.
const CURRENCIES_API_URL =
  "https://api.frankfurter.dev/v1/currencies";

// GET runs when someone requests /api/currencies.
export async function GET() {
  try {
    // Ask Frankfurter for its currency list.
    const response = await fetch(CURRENCIES_API_URL, {
      cache: "force-cache",
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });

    // Handle an unsuccessful response from Frankfurter.
    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load supported currencies." },
        { status: 502 }
      );
    }

    // Convert the received JSON response into JavaScript data.
    const currencies = await response.json();

    // Check that the response has the expected object structure.
    if (
      !currencies ||
      typeof currencies !== "object" ||
      Array.isArray(currencies)
    ) {
      return NextResponse.json(
        { error: "The currency provider returned invalid data." },
        { status: 502 }
      );
    }

    // Send the currency list back to our frontend.
    return NextResponse.json(currencies);
  } catch {
    // Handle network failures and request timeouts.
    return NextResponse.json(
      { error: "Could not load currencies. Please try again." },
      { status: 502 }
    );
  }
}