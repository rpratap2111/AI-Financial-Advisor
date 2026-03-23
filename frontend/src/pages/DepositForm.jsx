import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

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
      setResult({
        recommendation: data.investment_recommendation,
        insight: data.generative_insight
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white max-w-4xl mx-auto">
      <div className="mb-6 mt-10 bg-indigo-900/40 border border-indigo-500/40 p-5 rounded-xl shadow-inner w-full">
        <h3 className="text-lg font-bold mb-2 text-indigo-300 flex items-center gap-2">
          The Butterfly Effect Simulator
        </h3>
        <p className="text-indigo-200/80 text-sm mb-2">Along with standard mathematical ML predictions for term deposits, our Generative AI will analyze your specific inputs to find the <strong>exact 1 or 2 small hypothetical changes</strong> that would completely flip your financial trajectory.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Deposit Recommendation</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 shadow-lg rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <select
          name="job"
          value={formData.job}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        >
          <option value="">Select Job</option>
          <option value="management">Management</option>
          <option value="blue-collar">Blue Collar</option>
          <option value="technician">Technician</option>
          <option value="student">Student</option>
          <option value="self-employed">Self Employed</option>
        </select>

        <select
          name="marital"
          value={formData.marital}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        >
          <option value="">Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
        </select>

        <div>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          >
            <option value="">Education</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="tertiary">Tertiary</option>
          </select>
          <p className="text-xs text-gray-400 mt-1 ml-1">
            <b>Primary</b>: Up to 8th Grade | <b>Secondary</b>: High School | <b>Tertiary</b>: College/University
          </p>
        </div>

        <input
          type="number"
          name="balance"
          placeholder="Account Balance (₹)"
          value={formData.balance}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <select
          name="investment_preference"
          value={formData.investment_preference}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 border border-gray-700"
        >
          <option value="">Where do you invest? (Optional)</option>
          <option value="stocks">Stock Market</option>
          <option value="crypto">Cryptocurrency</option>
          <option value="real_estate">Real Estate</option>
          <option value="savings">High-Yield Savings</option>
          <option value="none">I don't invest yet</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-bold disabled:opacity-50 transition-opacity"
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>
      </form>

      {result && <ResultCard 
        title="Deposit & Investment Strategy" 
        message={result.recommendation}
        isPositive={result.recommendation.includes("Highly Suitable")}
        insight={result.insight} 
      />}
    </div>
  );
};

export default DepositForm;
