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

      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
        Deposit Prediction
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-xl space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="job"
            value={formData.job}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Job</option>
            <option value="management">Management</option>
            <option value="blue-collar">Blue Collar</option>
            <option value="technician">Technician</option>
            <option value="student">Student</option>
            <option value="self-employed">Self Employed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            name="marital"
            value={formData.marital}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Marital Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
          </select>

          <div className="space-y-1">
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Education</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="tertiary">Tertiary</option>
            </select>
            <p className="text-[10px] text-gray-500 px-1 leading-tight">
              <b>Primary</b>: &lt;8th | <b>Secondary</b>: High School | <b>Tertiary</b>: Degree
            </p>
          </div>
        </div>

        <input
          type="number"
          name="balance"
          placeholder="Account Balance (₹)"
          value={formData.balance}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-gray-800/80 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
          required
        />

        <select
          name="investment_preference"
          value={formData.investment_preference}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Investment Preference (Optional)</option>
          <option value="stocks">Stock Market</option>
          <option value="crypto">Cryptocurrency</option>
          <option value="real_estate">Real Estate</option>
          <option value="savings">High-Yield Savings</option>
          <option value="none">I don't invest yet</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-50 transition-all shadow-xl active:scale-95"
        >
          {loading ? "Analyzing Factors..." : "Generate Prediction"}
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
