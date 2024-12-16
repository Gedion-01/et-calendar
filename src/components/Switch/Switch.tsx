import "./Switch.css";

interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onChange, className }: CustomSwitchProps) {
  return (
    <div
      className={`switch ${className || ""} ${checked ? "checked" : ""}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onChange(!checked);
        }
      }}
    >
      <div className="switch-thumb" />
    </div>
  );
}
