import React from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Search, FileText, BookOpen, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContractSection } from '@/types/playbook';
import { SearchResult } from '@/hooks/usePlaybookSearch';
import { HighlightMatches } from './HighlightMatches';

interface PlaybookSearchProps {
  search: string;
  searchOpen: boolean;
  searchResults: SearchResult[];
  setSearch: (value: string) => void;
  setSearchOpen: (value: boolean) => void;
  onSearchSelect: (item: SearchResult) => void;
}

export function PlaybookSearch({
  search,
  searchOpen,
  searchResults,
  setSearch,
  setSearchOpen,
  onSearchSelect,
}: PlaybookSearchProps) {
  return (
    <div className="relative w-full sm:w-[260px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id="playbook-search-input"
        placeholder="Search playbook... (Ctrl+K)"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          if (e.target.value.trim()) {
            setSearchOpen(true);
          }
        }}
        onFocus={() => setSearchOpen(!!search.trim())}
        onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        className="pl-9 pr-8 h-9 rounded-md text-sm w-full"
        autoComplete="off"
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {searchOpen && search.trim() && (
        <div className="absolute z-20 mt-1 w-full sm:w-96 right-0 bg-popover border rounded-md shadow-lg overflow-hidden">
          <Command shouldFilter={false}>
            <div className="px-2 py-1.5 border-b text-xs text-muted-foreground">
              {searchResults.length} results
            </div>
            <CommandList>
              {searchResults.length === 0 && <CommandEmpty>No results found</CommandEmpty>}
              {searchResults.map((item, i) => (
                <CommandItem
                  key={`${item.type}-${item.clause?.id || item.section.id}-${i}`}
                  value={item.type === "section" ? item.section.title : item.clause.title}
                  onSelect={() => onSearchSelect(item)}
                  className="flex flex-col items-start px-3 py-2"
                >
                  <SearchResultItem item={item} query={search} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

function SearchResultItem({ item, query }: { item: SearchResult; query: string }) {
  return (
    <>
      <div className="flex w-full items-center gap-2">
        {item.type === "section" ? (
          <BookOpen className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
        )}
        <span className="font-medium text-sm">
          {item.type === "section" ? item.section.title : item.clause.title}
        </span>
      </div>
      
      <div className="w-full flex flex-col gap-1 mt-0.5">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto w-fit">
          {item.type === "section" ? "Section" : `In ${item.section.title.substring(0, 20)}...`}
        </Badge>
        {item.matchContext && (
          <p className="line-clamp-1 text-[11px] text-muted-foreground">
            <HighlightMatches text={item.matchContext} query={query} maxLength={100} />
          </p>
        )}
      </div>
    </>
  );
}
