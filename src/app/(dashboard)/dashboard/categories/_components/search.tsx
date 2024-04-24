"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import { useDebouncedCallback } from "use-debounce";

interface CategorySearchProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export function Search({ query, setQuery }: CategorySearchProps) {
  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      setQuery(term);
    } else {
      setQuery("");
    }
  });

  return (
    <div className="relative flex-1 md:grow-0">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={query}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
      />
    </div>
  );
}
