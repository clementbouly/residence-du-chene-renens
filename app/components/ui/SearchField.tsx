import { Search, X } from "lucide-react";
import styles from "./SearchField.module.css";

type SearchFieldProps = {
  ariaLabel: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function SearchField({
  ariaLabel,
  onValueChange,
  placeholder,
  value,
}: SearchFieldProps) {
  return (
    <div className={styles.field} role="search">
      <Search aria-hidden="true" size={20} strokeWidth={2} />
      <input
        aria-label={ariaLabel}
        name="search"
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onValueChange("");
        }}
        placeholder={placeholder}
      />
      {value && (
        <button
          className={styles.clear}
          type="button"
          aria-label="Effacer la recherche"
          onClick={() => onValueChange("")}
        >
          <X aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
