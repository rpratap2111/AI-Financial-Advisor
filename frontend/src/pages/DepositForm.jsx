import React, { useState } from "react";
import Field from "../components/Field";
import ResultCard from "../components/ResultCard";

const DepositForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    job: "",
    marital: "",
    education: "",
    balance: "",
    loan: "no",
    housing: "yes",
    investment_preference: ""
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

    const payload = {
      ...formData,
      default: "no",
      contact: "cellular",
      day: 1,
      month: "may",
      duration: 120,
      campaign: 1,
      pdays: 999,
      previous: 0,
      poutcome: "unknown"
    };

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_URL}/predict/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          recommendation: data.investment_recommendation,
          insight: data.generative_insight
        });
      } else {
        console.error("Error:", data.error);
        setError("The prediction failed. Check your details and try again");
      }
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Try again in a moment");
    } finally {
      setLoading(false);
    }
  };

  const isPositive = result?.recommendation.includes("Highly Suitable");

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-x-16 lg:py-16">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="text-[32px] leading-tight font-medium">Deposit prediction</h1>
        <h2 className="mt-6 text-base font-medium">The butterfly effect simulator</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-fg-2">
          Along with a machine learning prediction for term deposits, the AI looks at your inputs
          to find the one or two small hypothetical changes that would flip your financial
          trajectory.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 self-start rounded-xl border border-line bg-card p-6 sm:grid-cols-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <Field label="Age">
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="field" required />
        </Field>

        <Field label="Job">
          <select name="job" value={formData.job} onChange={handleChange} className="field" required>
            <option value="">Select</option>
            <option value="management">Management</option>
            <option value="blue-collar">Blue collar</option>
            <option value="technician">Technician</option>
            <option value="student">Student</option>
            <option value="self-employed">Self-employed</option>
          </select>
        </Field>

        <Field label="Marital status">
          <select name="marital" value={formData.marital} onChange={handleChange} className="field" required>
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
          </select>
        </Field>

        <Field label="Education" hint="Primary: below 8th. Secondary: high school. Tertiary: degree">
          <select name="education" value={formData.education} onChange={handleChange} className="field" required>
            <option value="">Select</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="tertiary">Tertiary</option>
          </select>
        </Field>

        <Field label="Account balance (₹)" className="sm:col-span-2">
          <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="field" required />
        </Field>

        <Field label="Investment preference (optional)" className="sm:col-span-2">
          <select name="investment_preference" value={formData.investment_preference} onChange={handleChange} className="field">
            <option value="">Select</option>
            <option value="stocks">Stock market</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="real_estate">Real estate</option>
            <option value="savings">High-yield savings</option>
            <option value="none">I don't invest yet</option>
          </select>
        </Field>

        <button type="submit" disabled={loading} className="btn btn-primary mt-2 sm:col-span-2">
          {loading ? "Analyzing" : "Generate prediction"}
        </button>

        {error && <p role="alert" className="text-sm leading-5 text-bad sm:col-span-2">{error}</p>}
      </form>

      {result && (
        <ResultCard
          className="lg:col-start-1 lg:row-start-2"
          title="Deposit and investment strategy"
          message={result.recommendation}
          stamp={isPositive ? "Highly suitable" : "Not ideal"}
          isPositive={isPositive}
          insight={result.insight}
        />
      )}
    </div>
  );
};

export default DepositForm;
