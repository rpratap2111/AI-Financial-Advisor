import { useState } from "react";
import ResultCard from "../components/ResultCard";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

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
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="mb-6 mt-10 bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">Credit Risk Assessment</h2>
        <p className="text-gray-300 mb-2">
          This tool helps predict whether a customer is likely to default on credit card payments.  
          By analyzing factors such as income, spending, repayment history, and bill amounts,  
          the model estimates the risk of default.
        </p>
        <ul className="list-disc pl-6 text-gray-400 text-sm">
          <li><b>Credit Limit & Age</b> → shows financial capacity and stability.</li>
          <li><b>Education & Marital Status</b> → socio-economic background indicators.</li>
          <li><b>Payment History (PAY_0 … PAY_6)</b> → how timely past repayments were.</li>
          <li><b>Bill Amounts</b> → outstanding dues from previous months.</li>
          <li><b>Payment Amounts</b> → actual repayment behavior over time.</li>
        </ul>
      </div>

      <div className="mb-8 bg-indigo-900/40 border border-indigo-500/40 p-5 rounded-xl shadow-inner">
        <h3 className="text-lg font-bold mb-2 text-indigo-300 flex items-center gap-2">
          Understanding the AI Dual Perspectives
        </h3>
        <p className="text-indigo-200/80 text-sm mb-4">After calculating your mathematical risk limit, our Generative AI will analyze your profile from two extreme opposite financial philosophies:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
          <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700/50 shadow-md">
            <span className="font-bold text-blue-400 block mb-1 text-base">The Boomer Investor</span>
            <span className="text-gray-400 leading-relaxed font-light">A traditional, conservative personality (like Warren Buffett). Focuses on long-term safety, extremely low risk, and slow but steady wealth building. Expect wise, cautious, "old-school" warnings.</span>
          </div>
          <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700/50 shadow-md">
            <span className="font-bold text-pink-400 block mb-1 text-base">The Degen Trader</span>
            <span className="text-gray-400 leading-relaxed font-light">A reckless, meme-culture internet personality (like Reddit's r/WallStreetBets). Focuses on high-risk, high-reward "YOLO" trades. Expect internet slang and absolutely terrible (but hilarious) advice.</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-0">
        <div className="col-span-1 sm:col-span-2 font-semibold text-lg text-blue-400">User Info</div>
        <input name="LIMIT_BAL" type="number" value={formData.LIMIT_BAL} onChange={handleChange} placeholder="Credit Limit (₹)" className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        <select name="SEX" value={formData.SEX} onChange={handleChange} className="p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none">
          <option value="">Select Gender</option>
          <option value={1}>Male</option>
          <option value={2}>Female</option>
        </select>
        <select name="EDUCATION" value={formData.EDUCATION} onChange={handleChange} className="p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none">
          <option value="">Select Education</option>
          <option value={1}>Graduate School</option>
          <option value={2}>University</option>
          <option value={3}>High School</option>
          <option value={4}>Others</option>
        </select>
        <select name="MARRIAGE" value={formData.MARRIAGE} onChange={handleChange} className="p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none">
          <option value="">Select Marital Status</option>
          <option value={1}>Married</option>
          <option value={2}>Single</option>
          <option value={3}>Others</option>
        </select>
        <input name="AGE" type="number" value={formData.AGE} onChange={handleChange} placeholder="Age" className="p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none col-span-1 sm:col-span-2" />

        <div className="col-span-1 sm:col-span-2 font-semibold text-lg text-blue-400 mt-6">Payment History</div>
        <div className="grid grid-cols-1 gap-4 col-span-1 sm:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6"].map((field) => (
              <select key={field} name={field} value={formData[field]} onChange={handleChange} className="p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none">
                <option value="">Select {field}</option>
                <option value={-1}>Paid Duly</option>
                <option value={0}>No Delay</option>
                <option value={1}>Delay 1 Month</option>
                <option value={2}>Delay 2 Months</option>
                <option value={3}>Delay 3 Months</option>
                <option value={4}>Delay 4 Months</option>
                <option value={5}>Delay 5 Months</option>
                <option value={6}>Delay 6 Months</option>
              </select>
            ))}
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 font-semibold text-lg text-blue-400 mt-6">Bills & Payments</div>
        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Bill Amounts</h4>
            {["BILL_AMT1", "BILL_AMT2", "BILL_AMT3", "BILL_AMT4", "BILL_AMT5", "BILL_AMT6"].map((field) => (
              <input key={field} name={field} type="number" value={formData[field]} onChange={handleChange} placeholder={`${field}`} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none" />
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Payment History</h4>
            {["PAY_AMT1", "PAY_AMT2", "PAY_AMT3", "PAY_AMT4", "PAY_AMT5", "PAY_AMT6"].map((field) => (
              <input key={field} name={field} type="number" value={formData[field]} onChange={handleChange} placeholder={`${field}`} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none" />
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="col-span-1 sm:col-span-2 mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl disabled:opacity-50 transition-all shadow-lg active:scale-95">
          {loading ? "Analyzing Financial Context..." : "Calculate Risk Assessment"}
        </button>
      </form>

      {result !== null && (
        <ResultCard
          title="Risk Assessment Result"
          message={result.riskLevel === 0 ? "Low Risk - Investment Safe ✅" : "High Risk - Default Chance ⚠️"}
          isPositive={result.riskLevel === 0}
          insight={result.insight}
        />
      )}
    </div>
  );
};

export default RiskForm;
