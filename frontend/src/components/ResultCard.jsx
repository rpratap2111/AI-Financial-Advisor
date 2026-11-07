import ReactMarkdown from "react-markdown";
import { PassbookPage, Stamp } from "./Passbook";

const ResultCard = ({ title, result, message, stamp, isPositive: forcePositive, insight, className = "" }) => {
  const isPositive = forcePositive !== undefined
    ? forcePositive
    : (result === "yes" || result === 1 || result === "recommended");

  return (
    <PassbookPage className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-paper-rule py-6 pr-4 pl-12 sm:pr-6 sm:pl-14">
        <div className="min-w-0 flex-1 basis-48">
          <h3 className="text-[13px] leading-4 text-paper-ink-2">{title}</h3>
          <p className="mt-2 text-xl leading-7 font-medium">
            {message || (isPositive ? "Positive recommendation" : "High risk, not recommended")}
          </p>
        </div>
        <Stamp tone={isPositive ? "good" : "bad"}>
          {stamp || (isPositive ? "Recommended" : "Not recommended")}
        </Stamp>
      </div>

      {insight && (
        <div className="py-6 pr-4 pl-12 sm:pr-6 sm:pl-14">
          <h4 className="text-[13px] leading-4 text-paper-ink-2">AI advisor insight</h4>
          <div className="markdown-body handwritten mt-3">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        </div>
      )}
    </PassbookPage>
  );
};

export default ResultCard;
