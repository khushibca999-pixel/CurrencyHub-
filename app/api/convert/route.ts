import { NextResponse } from "next/server";

const API_URL = "https://api.frankfurter.dev/v1/latest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();
  const amountText = searchParams.get("amount");

  // 1. Check that all required inputs were supplied.
  if (!from || !to || amountText === null) {
    return NextResponse.json(
      {
        error: "Please provide from, to, and amount.",
      },
      { status: 400 }
    );
  }

  // 2. Validate currency codes.
  if (
    !/^[A-Z]{3}$/.test(from) ||
    !/^[A-Z]{3}$/.test(to)
  ) {
    return NextResponse.json(
      { error: "Currency codes must contain three letters." },
      { status: 400 }
    );
  }

  // 3. Validate the amount.
  const amount = Number(amountText);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 1_000_000_000_000
  ) {
    return NextResponse.json(
      { error: "Amount must be greater than zero and no more than 1 trillion." },
      { status: 400 }
    );
  }

  // 4. Handle conversion to the same currency.
  if (from === to) {
    return NextResponse.json({
      from,
      to,
      amount,
      rate: 1,
      convertedAmount: amount,
      rateDate: null,
      message: "Both currencies are the same; no exchange is needed.",
    });
  }

  try {
    // 5. Ask the external API for the latest available exchange rate.
    const url = new URL(API_URL);
    url.searchParams.set("base", from);
    url.searchParams.set("symbols", to);

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "The exchange-rate provider could not fulfil this request. Check the currency codes or try again later.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    const rate = data.rates?.[to];

    // 6. Confirm that the provider returned a usable rate.
    if (
      typeof rate !== "number" ||
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      return NextResponse.json(
        { error: "No valid exchange rate was returned for this currency pair." },
        { status: 502 }
      );
    }

    // 7. Calculate the conversion using the returned rate.
    const convertedAmount = amount * rate;

    if (!Number.isFinite(convertedAmount)) {
      return NextResponse.json(
        { error: "The converted amount is outside the supported numeric range." },
        { status: 400 }
      );
    }

    // 8. Return the result and the provider's rate date.
    return NextResponse.json({
      from,
      to,
      amount,
      rate,
      convertedAmount,
      rateDate: data.date,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach the exchange-rate provider. Check your internet connection and try again.",
      },
      { status: 502 }
    );
  }
}