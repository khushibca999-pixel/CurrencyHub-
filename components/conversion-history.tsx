"use client";

import { useEffect, useState } from "react";

type HistoryRecord = {
  id: number;
  from_currency: string;
  to_currency: string;
  amount: number;
  converted_amount: number;
  exchange_rate: number;
  created_at: string;
};

export default function ConversionHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/history");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load history.");
      }

      if (!Array.isArray(data.history)) 
      {
        throw new Error("Invalid history data received from server.");
      }

      setHistory(data.history);
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteHistory(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this history record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete.");
      }

      // Remove the deleted record from the screen
      setHistory((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Delete failed."
      );
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <section className="rounded-2xl border p-5">
      <div className="history-toolbar">
        <button
          type="button"
          onClick={loadHistory}
          disabled={loading}
          className="history-refresh-button"
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {loading && (
        <p className="history-status">
          Loading conversion history...
        </p>
      )}

      {error && (
        <p className="history-error"  role="alert">
          {error}
        </p>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="empty-history">
          <div className="empty-history-icon">◷</div>

          <strong>No saved conversions yet</strong>

          <p>
            Your successful conversions will appear here.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="history-list">
          {history.map((item) => (
            <div
              key={item.id}
              className="history-item"
            >
              <div className="history-item-details">
                <p className="history-currency-pair">
                  {item.from_currency} → {item.to_currency}
                </p>

                <p className="history-original-amount">
                  Amount: {item.amount} {item.from_currency}
                </p>

                <p className="history-rate">
                  Rate: 1 {item.from_currency} ={" "}
                  {item.exchange_rate} {item.to_currency}
                </p>

                <p className="history-date">
                  {new Date(item.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="history-item-actions">
                <p className="history-item-amount">
                  {item.converted_amount.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 6,
                    }
                  )}{" "}
                  {item.to_currency}
                </p>

                <button
                  type="button"
                  onClick={() => deleteHistory(item.id)}
                  className="history-delete-button"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
}