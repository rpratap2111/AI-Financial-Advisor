const Field = ({ label, hint, className = "", children }) => (
  <label className={`flex flex-col gap-2 ${className}`}>
    <span className="text-[13px] leading-4 text-fg-2">{label}</span>
    {children}
    {hint && <span className="text-xs leading-4 text-fg-3">{hint}</span>}
  </label>
);

export default Field;
