import { useState, useEffect, useRef } from "react";
import { Sparkles, Search, X, Loader2, CheckCircle2 } from "lucide-react";

interface NaturalSearchBarProps {
  onSearch: (query: string) => Promise<void>;
  onClear: () => void;
  isSearching: boolean;
  error: string | null;
  appliedQuery: string;
}

const PLACEHOLDER_EXAMPLES = [
  "Casa con alberca en Orizaba por menos de 3 millones...",
  "Departamento nuevo con estacionamiento en Córdoba...",
  "Terreno en Fortín de hasta 500 mil pesos...",
  "Casa usada con jardín y 3 recámaras...",
  "Local comercial en zona centro hasta 2 MDP...",
];

const SUGGESTION_CHIPS = [
  "Casa con alberca",
  "Depto nuevo en Córdoba",
  "Terreno hasta 500k",
  "Casa con jardín y gimnasio",
];

const NaturalSearchBar = ({
  onSearch,
  onClear,
  isSearching,
  error,
  appliedQuery,
}: NaturalSearchBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cicla el placeholder cada 3.5 segundos cuando el input está vacío y sin foco
  useEffect(() => {
    if (isFocused || inputValue) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isFocused, inputValue]);

  const handleSubmit = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSearching) return;
    await onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleChipClick = (chip: string) => {
    setInputValue(chip);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
    inputRef.current?.focus();
  };

  const hasAppliedSearch = !!appliedQuery;

  return (
    <div className="w-full mb-6">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-champagne" />
        <span className="text-sm font-medium text-primary">
          Búsqueda Inteligente
        </span>
        <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
          Con IA
        </span>
      </div>

      {/* Input container */}
      <div
        className={`
          relative flex items-center rounded-2xl border-2 transition-all duration-300 bg-card
          ${
            isFocused
              ? "border-champagne shadow-[0_0_0_4px_rgba(212,175,55,0.12)]"
              : error
              ? "border-destructive/50"
              : "border-border hover:border-champagne/40"
          }
        `}
      >
        {/* Left icon */}
        <div className="pl-4 pr-2 flex-shrink-0">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-champagne animate-spin" />
          ) : (
            <Sparkles
              className={`w-5 h-5 transition-colors ${
                isFocused ? "text-champagne" : "text-muted-foreground"
              }`}
            />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isSearching}
          placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
          className="
            flex-1 bg-transparent py-4 text-sm text-foreground
            placeholder:text-muted-foreground/60 placeholder:transition-all
            outline-none disabled:cursor-not-allowed
          "
        />

        {/* Clear button */}
        {inputValue && !isSearching && (
          <button
            onClick={handleClear}
            className="p-2 mr-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isSearching}
          type="button"
          className="
            mr-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-champagne text-white transition-all duration-200
            hover:bg-champagne/90 hover:shadow-md
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
            active:scale-95
          "
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Analizando...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar</span>
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-xs text-destructive flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" />
          {error}
        </p>
      )}

      {/* Applied search banner */}
      {hasAppliedSearch && !error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-champagne bg-champagne/8 border border-champagne/20 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 truncate">
            Filtros aplicados para: <strong>"{appliedQuery}"</strong>
          </span>
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 flex-shrink-0"
            type="button"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Suggestion chips — visible solo si no hay filtro activo ni texto */}
      {!hasAppliedSearch && !inputValue && !isFocused && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              type="button"
              className="
                text-xs px-3 py-1.5 rounded-full border border-border
                text-muted-foreground bg-card hover:border-champagne/50
                hover:text-champagne hover:bg-champagne/5
                transition-all duration-200 active:scale-95
              "
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NaturalSearchBar;
