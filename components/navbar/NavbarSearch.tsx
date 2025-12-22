    // components/navbar/NavbarSearch.tsx
    'use client';
    import { useState, useRef, useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { Input } from '@/components/ui/input';
    import { Search, X } from 'lucide-react';
    import { Card } from '@/components/ui/card';

    export default function NavbarSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        setQuery('');
        setShowSuggestions(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10 h-9"
        />
        {query && (
            <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
            <X className="h-4 w-4" />
            </button>
        )}
        </form>
    );
    }   