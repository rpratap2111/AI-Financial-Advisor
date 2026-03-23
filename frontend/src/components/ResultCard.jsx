import React from "react";
import ReactMarkdown from "react-markdown";

const ResultCard = ({ title, result, message, isPositive: forcePositive, insight }) => {
  const isPositive = forcePositive !== undefined 
    ? forcePositive 
    : (result === "yes" || result === 1 || result === "recommended");

  return (
    <div
      className={`mt-6 p-6 rounded-xl shadow-lg border text-center font-bold ${
        isPositive 
          ? "bg-emerald-900/50 border-emerald-500/50 text-emerald-100" 
          : "bg-red-900/50 border-red-500/50 text-red-100"
      } backdrop-blur-md`}
    >
      <h3 className="text-2xl tracking-wide">{title}</h3>
      <p className="mt-3 text-xl">
        {message ? message : (isPositive ? "✅ Positive Recommendation" : "⚠️ High Risk / Not Recommended")} 
      </p>

      {insight && (
        <div className="mt-6 p-5 bg-black/40 rounded-lg text-left shadow-inner border border-white/10 markdown-body">
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-sans font-bold">AI Advisor Insight</h4>
          <div className="text-gray-200 text-sm leading-relaxed font-normal">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
