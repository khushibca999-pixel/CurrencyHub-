"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

// Each currency has a three-letter code and a readable name.
type CurrencyList = Record<string, string>;

// This describes the JSON returned by /api/convert.
type ConversionResult = {
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  rateDate: string | null;
  message?: string;
};

type CurrencyHubDashboardProps = {
  userEmail: string;
};

export default function CurrencyHubDashboard({userEmail,}: CurrencyHubDashboardProps)
{
  // The amount entered by the user.
  const [amount, setAmount] = useState("100");

  // The currently selected currencies.
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  // All currencies received from our currencies API.
  const [currencies, setCurrencies] = useState<CurrencyList>({});

  // Currency-list loading and error states.
  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const [currenciesError, setCurrenciesError] = useState("");

  // Conversion result and conversion status.
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState("");

  // STEP 1: Load the supported currency list when the page opens.
  useEffect(() => {
    async function loadCurrencies() {
      try {
        setCurrenciesLoading(true);
        setCurrenciesError("");

        const response = await fetch("/api/currencies");

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Could not load supported currencies.";

          throw new Error(message);
        }

        // Check that the API returned an object.
        if (
          typeof data !== "object" ||
          data === null ||
          Array.isArray(data)
        ) {
          throw new Error("The currency list has an unexpected format.");
        }

        const currencyData = data as CurrencyList;

        // Keep only entries with valid-looking codes and names.
        const validCurrencies = Object.fromEntries(
          Object.entries(currencyData).filter(
            ([code, name]) =>
              /^[A-Z]{3}$/.test(code) &&
              typeof name === "string"
          )
        );

        if (Object.keys(validCurrencies).length === 0) {
          throw new Error("No supported currencies were returned.");
        }

        setCurrencies(validCurrencies);

        // Use familiar defaults if the provider supports them.
        if (!validCurrencies[fromCurrency]) {
          setFromCurrency(Object.keys(validCurrencies)[0]);
        }

        if (!validCurrencies[toCurrency]) {
          setToCurrency(
            validCurrencies.INR
              ? "INR"
              : Object.keys(validCurrencies)[0]
          );
        }
      } catch (error) {
        setCurrenciesError(
          error instanceof Error
            ? error.message
            : "Could not load supported currencies."
        );
      } finally {
        setCurrenciesLoading(false);
      }
    }

    loadCurrencies();
  }, [fromCurrency, toCurrency]);

  // STEP 2: Request a conversion from our Next.js API.
  async function handleConvert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setConversionError("");
    setResult(null);

    const numericAmount = Number(amount);

    // Basic frontend validation.
    // The backend independently validates the same request.
    if (amount.trim() === "") {
      setConversionError("Please enter an amount.");
      return;
    }

    if (!Number.isFinite(numericAmount)) {
      setConversionError("Please enter a valid number.");
      return;
    }

    if (numericAmount <= 0) {
      setConversionError("The amount must be greater than zero.");
      return;
    }

    if (!currencies[fromCurrency] || !currencies[toCurrency]) {
      setConversionError("Please select supported currencies.");
      return;
    }

    try {
      setConversionLoading(true);

      // Build the request URL safely.
      const params = new URLSearchParams({
        from: fromCurrency,
        to: toCurrency,
        amount: amount.trim(),
      });

      const response = await fetch(`/api/convert?${params.toString()}`);

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Conversion failed. Please try again.";

        throw new Error(message);
      }

      // Confirm that the API returned the required numeric values.
      if (
        typeof data !== "object" ||
        data === null ||
        !("from" in data) ||
        !("to" in data) ||
        !("amount" in data) ||
        !("rate" in data) ||
        !("convertedAmount" in data ||
          "rateDate" in data)
      ) {
        throw new Error("The conversion API returned unexpected data.");
      }

      const responseData = data as ConversionResult;

      if (
        typeof responseData.rate !== "number" ||
        !Number.isFinite(responseData.rate) ||
        typeof responseData.convertedAmount !== "number" ||
        !Number.isFinite(responseData.convertedAmount)
      ) {
        throw new Error("The conversion result is invalid.");
      }

      setResult(responseData);
    } catch (error) {
      setConversionError(
        error instanceof Error
          ? error.message
          : "Something went wrong during conversion."
      );
    } finally {
      setConversionLoading(false);
    }
  }

  // Format an amount for easier reading.
  function formatAmount(value: number, currency: string) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 4,
      }).format(value);
    } catch {
      return `${value.toLocaleString("en-US", {
        maximumFractionDigits: 4,
      })} ${currency}`;
    }
  }

  // Format the date returned by the exchange-rate provider.
  function formatRateDate(date: string | null) {
    if (!date) {
      return "No external rate required for identical currencies.";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return `Rate date: ${date}`;
    }

    return `Rate date: ${parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  return (
    <main className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/protected" className="brand">
          <span className="brand-icon">C</span>
          <span>CurrencyHub</span>
        </Link>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <Link href="/protected" className="nav-item active">
            <span>▦</span> Dashboard
          </Link>

          <a href="#converter" className="nav-item">
            <span>⇄</span> Converter
          </a>

          <a href="#history" className="nav-item">
            <span>◷</span> History
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help-icon">?</div>
          <div>
            <strong>Need some help?</strong>
            <p>Your currency workspace</p>
          </div>
        </div>
      </aside>

      {/* Main dashboard */}
      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Dashboard
          </div>

          <div className="profile-placeholder">
            <span className="status-dot" />

            <span>{userEmail}</span>

            <LogoutButton />
          </div>
          
        </header>

        <div className="dashboard-content">
          {/* Welcome section */}
          <section className="welcome-section">
            <div>
              <p className="eyebrow">YOUR CURRENCY WORKSPACE</p>
              <h1>Currency dashboard</h1>
              <p className="welcome-description">
                Convert currencies and keep track of your money across borders.
              </p>
            </div>

            <div className="welcome-date">
              <span className="date-icon">↗</span>
              Reference rates
            </div>
          </section>

          {/* Summary cards */}
          <section className="summary-grid">
            <article className="summary-card">
              <div className="summary-top">
                <span>Currency converter</span>
                <span className="summary-icon purple">⇄</span>
              </div>
              <h2>Simple &amp; fast</h2>
              <p>Convert supported currencies</p>
            </article>

            <article className="summary-card">
              <div className="summary-top">
                <span>Rate source</span>
                <span className="summary-icon green">↗</span>
              </div>
              <h2>Frankfurter</h2>
              <p>Periodically updated reference rates</p>
            </article>

            <article className="summary-card">
              <div className="summary-top">
                <span>Conversion history</span>
                <span className="summary-icon orange">◷</span>
              </div>
              <h2>Coming soon</h2>
              <p>Save conversions to your account</p>
            </article>
          </section>

          {/* Converter */}
          <section className="converter-card" id="converter">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CURRENCY TOOLS</p>
                <h2>Currency converter</h2>
                <p>Choose your currencies and enter an amount.</p>
              </div>

              <span className="live-badge">
                <span /> Reference rates
              </span>
            </div>

            {/* Submitting this form runs handleConvert(). */}
            <form onSubmit={handleConvert}>
              <div className="converter-form">
                <label className="form-field amount-field">
                  <span>Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setResult(null);
                      setConversionError("");
                    }}
                    placeholder="Enter amount"
                    required
                  />
                </label>

                <label className="form-field">
                  <span>From</span>
                  <select
                    value={fromCurrency}
                    onChange={(event) => {
                      setFromCurrency(event.target.value);
                      setResult(null);
                      setConversionError("");
                    }}
                    disabled={currenciesLoading || Object.keys(currencies).length === 0}
                  >
                    {currenciesLoading ? (
                      <option value={fromCurrency}>Loading currencies...</option>
                    ) : Object.keys(currencies).length === 0 ? (
                      <option value="">No currencies available</option>
                    ) : (
                      Object.entries(currencies)
                        .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
                        .map(([code, name]) => (
                          <option key={code} value={code}>
                            {code} — {name}
                          </option>
                        ))
                    )}
                  </select>
                </label>

                {/* Swap will be implemented in Stage 4. */}
                <button
                  type="button"
                  className="swap-button"
                  aria-label="Swap currencies"
                  title="Currency swapping will be enabled in Stage 4"
                  onClick={() => {
                    // Save the current source currency.
                    const previousFrom = fromCurrency;

                    // Move the target currency into the source position.
                    setFromCurrency(toCurrency);

                    // Move the previous source currency into the target position.
                    setToCurrency(previousFrom);

                    // Remove any result calculated for the previous currency pair.
                    setResult(null);
                    setConversionError("");
                  }}
                >
                  ⇄
                </button>

                <label className="form-field">
                  <span>To</span>
                  <select
                    value={toCurrency}
                    onChange={(event) => {
                      setToCurrency(event.target.value);
                      setResult(null);
                      setConversionError("");
                    }}
                    disabled={currenciesLoading || Object.keys(currencies).length === 0}
                  >
                    {currenciesLoading ? (
                      <option value={toCurrency}>Loading currencies...</option>
                    ) : Object.keys(currencies).length === 0 ? (
                      <option value="">No currencies available</option>
                    ) : (
                      Object.entries(currencies)
                        .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
                        .map(([code, name]) => (
                          <option key={code} value={code}>
                            {code} — {name}
                          </option>
                        ))
                    )}
                  </select>
                </label>
              </div>

              {/* Selected currencies and Convert button */}
              <div className="converter-actions">
                <p>
                  Selected pair:{" "}
                  <strong>
                    {fromCurrency} → {toCurrency}
                  </strong>
                </p>

                <div className="action-buttons">
                  {/* Restore the default form values. */}
                  <button
                    type="button"
                    className="reset-button"
                    onClick={() => {
                      setAmount("100");
                      setFromCurrency("USD");
                      setToCurrency("INR");
                      setResult(null);
                      setConversionError("");
                    }}
                  >
                    Reset
                  </button>

                  {/* Submit the form to perform a conversion. */}
                  <button
                    type="submit"
                    className="convert-button"
                    disabled={conversionLoading || currenciesLoading}
                  >
                    {conversionLoading ? "Converting..." : "Convert currency"}
                    {!conversionLoading && <span>→</span>}
                  </button>
                </div>
              </div>
            </form>

            {/* Currency-list loading and errors */}
            {currenciesLoading && (
              <p role="status">Loading supported currencies...</p>
            )}

            {currenciesError && (
              <p className="error-message" role="alert">
                Currency list: {currenciesError}
              </p>
            )}

            {/* Conversion errors */}
            {conversionError && (
              <p className="error-message" role="alert">
                {conversionError}
              </p>
            )}

            {/* Conversion result */}
            <div className="result-panel" aria-live="polite">
              <div>
                <p className="result-label">CONVERTED AMOUNT</p>

                {result ? (
                  <>
                    <h2>
                      {formatAmount(result.convertedAmount, result.to)}
                    </h2>

                    <p className="result-note">
                      {formatAmount(result.amount, result.from)} ={" "}
                      {formatAmount(result.convertedAmount, result.to)}
                    </p>

                    <p className="result-note">
                      1 {result.from} ={" "}
                      {result.rate.toLocaleString("en-US", {
                        maximumFractionDigits: 6,
                      })}{" "}
                      {result.to}
                    </p>

                    <p className="result-note">
                      {formatRateDate(result.rateDate)}
                    </p>

                    {result.message && (
                      <p className="result-note">{result.message}</p>
                    )}
                  </>
                ) : (
                  <>
                    <h2>—</h2>
                    <p className="result-note">
                      {conversionLoading
                        ? "Getting the exchange rate..."
                        : "Your conversion result will appear here."}
                    </p>
                  </>
                )}
              </div>

              <div className="result-symbol">↗</div>
            </div>
          </section>

          {/* History placeholder: database integration comes in Stage 6. */}
          <section className="history-card" id="history">
            <div className="history-heading">
              <div>
                <h2>Recent conversions</h2>
                <p>Your latest currency conversions will appear here.</p>
              </div>

              <span className="history-count">0 records</span>
            </div>

            <div className="empty-history">
              <div className="empty-history-icon">◷</div>
              <strong>No saved conversions yet</strong>
              <p>
                Conversion history will be saved to your account in Stage 6.
              </p>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>CurrencyHub</span>
            <span>
              Exchange rates are reference rates, not guaranteed trading rates.
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
