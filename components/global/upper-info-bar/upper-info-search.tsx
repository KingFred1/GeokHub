'use client';

import { useRouter } from 'next/navigation';
import * as React from "react";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, XIcon } from "lucide-react";
import { Suspense } from 'react';

// Inner component that uses searchParams
function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="pl-10 pr-4 py-2 w-full"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        {query && (
          <button type="button" onClick={handleClear} className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground">
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}

// Main SearchBar component with Suspense
export default function SearchBar() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-2 w-full"
            disabled
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    }>
      <SearchInput />
    </Suspense>
  );
}