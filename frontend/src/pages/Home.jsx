import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleIcon from "../components/GoogleIcon";
import { PassbookPage, PassbookRow, Stamp } from "../components/Passbook";

const features = [
  {
    title: "Butterfly effect",
    text: "Find the one or two specific lifestyle changes that would shift your financial outlook for the better.",
    to: "/deposit",
  },
  {
    title: "Dual perspectives",
    text: "Get roasted by a WallStreetBets Degen or advised by a wise Boomer investor, based on your risk profile.",
    to: "/risk",
  },
  {
    title: "AI chat",
    text: "Ask any financial question, and switch between professional, savage and Gen-Z personas.",
    to: "/chat",
  },
];

function Home() {
  const { user, loginWithGoogle } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid items-center gap-12 py-12 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-2 lg:gap-16 lg:py-16"
      >
        <div>
          <h1 className="text-[40px] leading-[1.08] font-medium tracking-[-0.02em] sm:text-[56px] sm:leading-[1.05] sm:tracking-[-0.03em]">
            Find the small change that flips your finances
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-fg-2">
            Predict whether a term deposit suits you, check your credit default risk, and get a
            second opinion from a cautious Boomer and a reckless Degen.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!user ? (
              <button onClick={loginWithGoogle} className="btn btn-primary">
                <GoogleIcon />
                Continue with Google
              </button>
            ) : (
              <>
                <Link to="/deposit" className="btn btn-primary">Deposit prediction</Link>
                <Link to="/risk" className="btn btn-secondary">Risk assessment</Link>
              </>
            )}
          </div>
        </div>

        <PassbookPage className="mx-auto w-full max-w-md lg:mr-0 lg:ml-auto">
          <div className="flex items-baseline justify-between gap-4 border-b border-paper-rule py-4 pr-4 pl-12 sm:pr-6 sm:pl-14">
            <span className="text-sm font-medium">Deposit prediction</span>
            <span className="text-xs text-paper-ink-2">Sample entry</span>
          </div>
          <PassbookRow label="Age" value="34" />
          <PassbookRow label="Job" value="Technician" />
          <PassbookRow label="Education" value="Tertiary" />
          <PassbookRow label="Account balance" value="₹1,42,500" />
          <PassbookRow label="Prediction" value="Not ideal" />
          <PassbookRow label="One change" value="Hold ₹40,000 more" />
          <div className="flex min-h-24 items-center justify-end py-4 pr-6 pl-12 sm:pl-14">
            <Stamp>Highly suitable</Stamp>
          </div>
        </PassbookPage>
      </motion.section>

      <section className="border-t border-line pb-16">
        {features.map(({ title, text, to }) => {
          const row = (
            <>
              <h2 className="text-base font-medium text-fg">{title}</h2>
              <p className="text-sm leading-6 text-fg-2">{text}</p>
            </>
          );
          const rowClass = "grid gap-2 border-b border-line py-6 sm:grid-cols-[240px_1fr_auto] sm:items-center sm:gap-8";

          return user ? (
            <Link key={title} to={to} className={`group ${rowClass}`}>
              {row}
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="hidden text-fg-3 transition-colors duration-150 group-hover:text-fg sm:block"
              />
            </Link>
          ) : (
            <div key={title} className={rowClass}>{row}</div>
          );
        })}
      </section>
    </div>
  );
}

export default Home;
