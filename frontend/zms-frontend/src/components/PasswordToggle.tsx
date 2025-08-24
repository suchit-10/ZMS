import { Eye, EyeOff } from "lucide-react";

type Props = {
  show: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export default function PasswordToggle({ show, onToggle, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={show}
      aria-label={show ? "Hide password" : "Show password"}
      className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <span className="sr-only">
        {show ? "Hide password" : "Show password"}
      </span>
      {show ? (
        <EyeOff size={16} aria-hidden="true" />
      ) : (
        <Eye size={16} aria-hidden="true" />
      )}
    </button>
  );
}
