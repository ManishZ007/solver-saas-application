"use client";

import React, { useState, useMemo } from "react";
import Post from "../post/Post";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";

type ShowPostContainerProps = {
  posts?: Array<PostType> | [];
  user?: User;
};

const ALL_TAGS = ["React", "Next.js", "TypeScript", "JavaScript", "Python", "Node", "CSS", "Database", "Git"];

const ShowPostContainer = ({ posts, user }: ShowPostContainerProps) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = posts ?? [];
    if (activeTag) {
      result = result.filter((p) => p.tags?.includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.username?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeTag, search]);

  return (
    <section className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9 rounded-xl"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setSearch("")}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Tag filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            activeTag === null
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary"
          }`}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTag === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(activeTag || search) && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {activeTag ? ` tagged "${activeTag}"` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      )}

      {/* Posts */}
      <div className="flex flex-col gap-4 p-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No posts found</p>
          </div>
        ) : (
          filtered.map((post) => (
            <Post key={post.id} post={post} user={user} />
          ))
        )}
      </div>
    </section>
  );
};

export default ShowPostContainer;
