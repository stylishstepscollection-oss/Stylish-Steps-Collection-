'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Popular/trending searches
  const popularSearches = [
    'Suits',
    'Batakari',
    'Shoes',
    'Accessories',
    'Custom',
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Reduced from 500ms for faster response

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setDebouncedQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-10 h-11"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && !query && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full z-50 shadow-lg border"
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Popular Searches</span>
            </div>
            <div className="space-y-1">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Search hint */}
      {query && debouncedQuery !== query && (
        <p className="absolute top-full mt-1 text-xs text-muted-foreground">
          Searching...
        </p>
      )}
    </div>
  );
}