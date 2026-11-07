import { useState } from "react";
import Field from "../components/Field";
import ResultCard from "../components/ResultCard";

// Each row of the ledger is one month. The dataset pairs PAY_0 with BILL_AMT1
// and PAY_AMT1, then PAY_2 with BILL_AMT2 and PAY_AMT2, and so on.
const months = [
  { label: "Last month", status: "PAY_0", bill: "BILL_AMT1", paid: "PAY_AMT1" },
  { label: "2 months ago", status: "PAY_2", bill: "BILL_AMT2", paid: "PAY_AMT2" },
  { label: "3 months ago", status: "PAY_3", bill: "BILL_AMT3", paid: "PAY_AMT3" },
  { label: "4 months ago", status: "PAY_4", bill: "BILL_AMT4", paid: "PAY_AMT4" },
  { label: "5 months ago", status: "PAY_5", bill: "BILL_AMT5", paid: "PAY_AMT5" },
  { label: "6 months ago", status: "PAY_6", bill: "BILL_AMT6", paid: "PAY_AMT6" },
];

const factors = [
  ["Credit limit and age", "Financial capacity and stability"],
  ["Education and marital status", "Socio-economic background"],
  ["Payment history", "How timely past repayments were"],
  ["Bill amounts", "Outstanding dues from previous months"],
  ["Payment amounts", "Actual repayment behavior over time"],
];

const RiskForm = () => {
  const [formData, setFormData] = useState({
    LIMIT_BAL: "",
    SEX: "",
    EDUCATION: "",
    MARRIAGE: "",
    AGE: "",
    PAY_0: "",
    PAY_2: "",
    PAY_3: "",
    PAY_4: "",
    PAY_5: "",
    PAY_6: "",
    BILL_AMT1: "",
    BILL_AMT2: "",
    BILL_AMT3: "",
    BILL_AMT4: "",
    BILL_AMT5: "",
    BILL_AMT6: "",
    PAY_AMT1: "",
    PAY_AMT2: "",
    PAY_AMT3: "",
    PAY_AMT4: "",
    PAY_AMT5: "",
    PAY_AMT6: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_URL}/predict/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          riskLevel: data.risk_assessment,
          insight: data.generative_insight
        });
      } else {
        console.error("Error:", data.error);
        setError("The assessment failed. Check your details and try again");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Could not reach the server. Try again in a moment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="text-[32px] leading-tight font-medium">Credit risk assessment</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-fg-2">
            This tool predicts whether a customer is likely to default on credit card payments. It
            looks at income, spending, repayment history and bill amounts to estimate the risk of
            default.
          </p>
        </div>
        <dl className="border-t border-line text-sm">
          {factors.map(([term, detail]) => (
            <div key={term} className="grid gap-1 border-b border-line py-3 sm:grid-cols-2 sm:gap-4">
              <dt className="text-fg">{term}</dt>
              <dd className="text-fg-2">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="mt-12">
        <h2 className="text-base font-medium">The AI dual perspectives</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-fg-2">
          After calculating your risk, the AI reads your profile from two opposite financial
          philosophies.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-card p-5">
            <h3 className="text-sm font-medium">The Boomer Investor</h3>
            <p className="mt-2 text-sm leading-6 text-fg-2">
              A traditional, conservative personality, like Warren Buffett. Focuses on long-term
              safety, very low risk and slow, steady wealth building. Expect cautious, old-school
              warnings.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-card p-5">
            <h3 className="text-sm font-medium">The Degen Trader</h3>
            <p className="mt-2 text-sm leading-6 text-fg-2">
              A reckless, meme-culture personality, like Reddit's r/WallStreetBets. Focuses on
              high-risk, high-reward YOLO trades. Expect internet slang and terrible but funny
              advice.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-12">
        <section>
          <h2 className="text-base font-medium">User info</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Credit limit (₹)" className="sm:col-span-2 lg:col-span-1">
              <input name="LIMIT_BAL" type="number" value={formData.LIMIT_BAL} onChange={handleChange} className="field" required />
            </Field>
            <Field label="Age">
              <input name="AGE" type="number" value={formData.AGE} onChange={handleChange} className="field" required />
            </Field>
            <Field label="Gender">
              <select name="SEX" value={formData.SEX} onChange={handleChange} className="field" required>
                <option value="">Select</option>
                <option value={1}>Male</option>
                <option value={2}>Female</option>
              </select>
            </Field>
            <Field label="Education">
              <select name="EDUCATION" value={formData.EDUCATION} onChange={handleChange} className="field" required>
                <option value="">Select</option>
                <option value={1}>Graduate school</option>
                <option value={2}>University</option>
                <option value={3}>High school</option>
                <option value={4}>Others</option>
              </select>
            </Field>
            <Field label="Marital status">
              <select name="MARRIAGE" value={formData.MARRIAGE} onChange={handleChange} className="field" required>
                <option value="">Select</option>
                <option value={1}>Married</option>
                <option value={2}>Single</option>
                <option value={3}>Others</option>
              </select>
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-base font-medium">Payment history, bills and payments</h2>
          <div className="mt-4 rounded-xl border border-line bg-card px-4 sm:px-5">
            <div className="hidden h-11 grid-cols-[120px_1fr_1fr_1fr] items-center gap-4 border-b border-line text-[13px] text-fg-2 sm:grid">
              <span>Month</span>
              <span>Repayment status</span>
              <span>Bill amount (₹)</span>
              <span>Amount paid (₹)</span>
            </div>
            {months.map(({ label, status, bill, paid }) => (
              <div
                key={status}
                className="grid grid-cols-2 items-center gap-x-4 gap-y-2 border-b border-line py-4 last:border-b-0 sm:grid-cols-[120px_1fr_1fr_1fr] sm:py-2"
              >
                <span className="col-span-2 text-sm text-fg sm:col-span-1">{label}</span>
                <select
                  name={status}
                  aria-label={`Repayment status, ${label}`}
                  value={formData[status]}
                  onChange={handleChange}
                  className="field col-span-2 sm:col-span-1"
                  required
                >
                  <option value="">Select</option>
                  <option value={-1}>Paid duly</option>
                  <option value={0}>No delay</option>
                  <option value={1}>Delayed 1 month</option>
                  <option value={2}>Delayed 2 months</option>
                  <option value={3}>Delayed 3 months</option>
                  <option value={4}>Delayed 4 months</option>
                  <option value={5}>Delayed 5 months</option>
                  <option value={6}>Delayed 6 months</option>
                </select>
                <input
                  name={bill}
                  type="number"
                  aria-label={`Bill amount in rupees, ${label}`}
                  placeholder="Bill"
                  value={formData[bill]}
                  onChange={handleChange}
                  className="field"
                  required
                />
                <input
                  name={paid}
                  type="number"
                  aria-label={`Amount paid in rupees, ${label}`}
                  placeholder="Paid"
                  value={formData[paid]}
                  onChange={handleChange}
                  className="field"
                  required
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto sm:self-start">
            {loading ? "Analyzing" : "Calculate risk assessment"}
          </button>
          {error && <p role="alert" className="text-sm leading-5 text-bad">{error}</p>}
        </div>
      </form>

      {result !== null && (
        <ResultCard
          className="mt-12 max-w-2xl"
          title="Risk assessment result"
          message={result.riskLevel === 0 ? "Low risk, investment safe" : "High risk, chance of default"}
          stamp={result.riskLevel === 0 ? "Low risk" : "High risk"}
          isPositive={result.riskLevel === 0}
          insight={result.insight}
        />
      )}
    </div>
  );
};

export default RiskForm;
