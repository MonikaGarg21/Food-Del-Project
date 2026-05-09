import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  Clock,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { StoreContext } from "../../context/UseStoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import "./Search.css";

const TRENDING = ["Burger", "Pizza", "Biryani", "Pasta", "Sushi", "Tacos"];

/* Bold-highlight the matching portion of text */
const Highlight = ({ text = "", query = "" }) => {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="sp__sugg-mark">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
};

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const queryParam = new URLSearchParams(location.search).get("query") || "";

  const [inputValue, setInputValue] = useState(queryParam);
  const [activeQuery, setActiveQuery] = useState(queryParam);
  const [showSugg, setShowSugg] = useState(false);
  const [activeSuggIdx, setActiveSuggIdx] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    } catch {
      return [];
    }
  });

  const { food_list } = useContext(StoreContext);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setShowSugg(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* sync URL param → component state */
  useEffect(() => {
    setInputValue(queryParam);
    setActiveQuery(queryParam);
    setShowSugg(false);
    if (queryParam) saveRecent(queryParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── helpers ── */
  const saveRecent = (q) =>
    setRecentSearches((prev) => {
      const next = [
        q,
        ...prev.filter((r) => r.toLowerCase() !== q.toLowerCase()),
      ].slice(0, 6);
      localStorage.setItem("recentSearches", JSON.stringify(next));
      return next;
    });

  const commitSearch = (q) => {
    const term = q.trim();
    if (!term) return;
    saveRecent(term);
    setShowSugg(false);
    setActiveSuggIdx(-1);
    navigate(`/search?query=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    commitSearch(inputValue);
  };
  const handleChip = (term) => {
    setInputValue(term);
    commitSearch(term);
  };

  const clearInput = () => {
    setInputValue("");
    setShowSugg(false);
    setActiveSuggIdx(-1);
    inputRef.current?.focus();
  };

  const removeRecent = (term, e) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const next = prev.filter((r) => r !== term);
      localStorage.setItem("recentSearches", JSON.stringify(next));
      return next;
    });
  };

  /* ── live suggestions: match by name only ── */
  const suggestions =
    inputValue.trim().length >= 1
      ? (food_list || [])
          .filter((item) =>
            item.name?.toLowerCase().includes(inputValue.trim().toLowerCase()),
          )
          .slice(0, 7)
      : [];

  /* keyboard navigation */
  const handleKeyDown = (e) => {
    if (!showSugg || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeSuggIdx >= 0) {
      e.preventDefault();
      const chosen = suggestions[activeSuggIdx].name;
      setInputValue(chosen);
      commitSearch(chosen);
    } else if (e.key === "Escape") {
      setShowSugg(false);
      setActiveSuggIdx(-1);
    }
  };

  /* ── results grid: name-based filter ── */
  const results = activeQuery
    ? (food_list || []).filter((item) =>
        item.name?.toLowerCase().includes(activeQuery.toLowerCase()),
      )
    : [];
  const hasResults = results.length > 0;
  const showEmpty = activeQuery && !hasResults;
  const showLanding = !activeQuery;

  return (
    <div className="sp">
      {/* ══ HERO ══ */}
      <div className="sp__hero">
        <div className="sp__hero-bg" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <p className="sp__eyebrow">What are you craving?</p>
        <h1 className="sp__title">
          {activeQuery ? (
            <>
              Results for <em>&ldquo;{activeQuery}&rdquo;</em>
            </>
          ) : (
            "Search our menu"
          )}
        </h1>

        {/* ── Search form + suggestions ── */}
        <form className="sp__form" onSubmit={handleSubmit} ref={wrapRef}>
          <div
            className={`sp__input-wrap ${showSugg && suggestions.length ? "sp__input-wrap--open" : ""}`}
          >
            <SearchIcon className="sp__input-icon" size={20} />
            <input
              ref={inputRef}
              className="sp__input"
              type="text"
              placeholder="Type a dish name…"
              value={inputValue}
              autoComplete="off"
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSugg(true);
                setActiveSuggIdx(-1);
              }}
              onFocus={() => inputValue.trim() && setShowSugg(true)}
              onKeyDown={handleKeyDown}
            />
            {inputValue && (
              <button
                type="button"
                className="sp__clear"
                onClick={clearInput}
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="sp__submit">
              Search
            </button>
          </div>

          {/* Dropdown */}
          {showSugg && suggestions.length > 0 && (
            <ul className="sp__sugg" role="listbox" aria-label="Suggestions">
              {suggestions.map((item, i) => (
                <li
                  key={item._id}
                  role="option"
                  aria-selected={i === activeSuggIdx}
                  className={`sp__sugg-item${i === activeSuggIdx ? " sp__sugg-item--active" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setInputValue(item.name);
                    commitSearch(item.name);
                  }}
                  onMouseEnter={() => setActiveSuggIdx(i)}
                >
                  <span className="sp__sugg-icon">
                    <SearchIcon size={14} />
                  </span>
                  <span className="sp__sugg-text">
                    <Highlight text={item.name} query={inputValue.trim()} />
                  </span>
                  <span className="sp__sugg-cat">{item.category}</span>
                  <span className="sp__sugg-price">₹{item.price}</span>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {/* ══ BODY ══ */}
      <div className="sp__body">
        {showLanding && (
          <div className="sp__landing">
            {recentSearches.length > 0 && (
              <section className="sp__section">
                <h2 className="sp__section-title">
                  <Clock size={16} /> Recent
                </h2>
                <div className="sp__chips">
                  {recentSearches.map((r) => (
                    <button
                      key={r}
                      className="sp__chip sp__chip--recent"
                      onClick={() => handleChip(r)}
                    >
                      {r}
                      <span
                        className="sp__chip-remove"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => removeRecent(r, e)}
                      >
                        <X size={12} />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            <section className="sp__section">
              <h2 className="sp__section-title">
                <TrendingUp size={16} /> Trending now
              </h2>
              <div className="sp__chips">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    className="sp__chip sp__chip--trending"
                    onClick={() => handleChip(t)}
                  >
                    {t}
                    <ChevronRight size={13} />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {hasResults && (
          <section className="sp__results">
            <p className="sp__count">
              <strong>{results.length}</strong> item
              {results.length !== 1 ? "s" : ""} found
            </p>
            <div className="sp__grid">
              {results.map((item) => (
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </section>
        )}

        {showEmpty && (
          <div className="sp__empty">
            <div className="sp__empty-icon">🍽️</div>
            <h2>No results for &ldquo;{activeQuery}&rdquo;</h2>
            <p>Try a different name, or browse trending dishes below.</p>
            <div className="sp__chips sp__chips--centered">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  className="sp__chip sp__chip--trending"
                  onClick={() => handleChip(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
