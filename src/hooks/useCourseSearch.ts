// hooks/useCourseSearch.ts
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { normalizeText } from "@/utils/normalize";
import { useDebounce } from "@/hooks/useDebounce";
import type { Course } from "@/utils/localStorage";

export function useCourseSearch(
  courses: Course[],
  query: string | null,
  opts?: {
    debounceMs?: number;
    limit?: number;
  }
) {
  const debounceMs = opts?.debounceMs ?? 250;
  const limit = opts?.limit ?? 200;

  const debouncedQ = useDebounce(query ?? "", debounceMs);
  const [results, setResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [indexReady, setIndexReady] = useState(false);

  // Build normalized documents for indexing (run once / when courses change)
  const normalizedDocs = useMemo(() => {
    // For search speed: we build lightweight objects referencing original course via id
    return courses.map((c) => {
      const course_code_norm = normalizeText(c.course_code || "");
      const course_name_norm = normalizeText(c.course_name || "");
      // flatten lecturers into single string for search
      const lecturers = (c.list_group || [])
        .map((g: any) => `${g.lecturer || ""} ${g.bt_lecturer || ""}`)
        .filter(Boolean)
        .map((s) => normalizeText(s))
        .join(" ");
      return {
        id: c.id,
        original: c,
        course_code_norm,
        course_name_norm,
        lecturers,
      };
    });
  }, [courses]);

  // Build Fuse index (useMemo so it doesn't rebuild on every render)
  const fuse = useMemo(() => {
    if (!normalizedDocs || normalizedDocs.length === 0) {
      setIndexReady(true);
      return null;
    }
    const options = {
      keys: [
        { name: "course_code_norm", weight: 3 },
        { name: "course_name_norm", weight: 2 },
        { name: "lecturers", weight: 1 },
      ],
      includeScore: true,
      threshold: 0.45, // tuning: 0.2 stricter, 0.5 looser
      ignoreLocation: true,
      useExtendedSearch: false,
    };
    const f = new Fuse(normalizedDocs, options);
    setIndexReady(true);
    return f;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* only rebuild when courses list changes */ JSON.stringify(courses.map(c => c.id))]); // cheap dependency to rebuild on course set change

  useEffect(() => {
    const q = (debouncedQ || "").trim();
    if (!q) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // FAST PATH: if user typed something like exact code / starts-with (contains digits),
    // try an O(N) prefix filter first — often returns immediate exact matches quickly.
    const qNorm = normalizeText(q);
    const looksLikeCode = /[0-9]/.test(q); // contains digit → probably course_code
    setIsSearching(true);

    if (looksLikeCode) {
      // prefix match on course_code first (fast, avoids fuzzy index cost)
      const prefixMatches = normalizedDocs
        .filter(d => d.course_code_norm.startsWith(qNorm))
        .slice(0, limit)
        .map(d => d.original);
      if (prefixMatches.length > 0) {
        setResults(prefixMatches);
        setIsSearching(false);
        return;
      }
      // else fall through to fuzzy search
    }

    // FUZZY PATH: use Fuse index
    if (fuse) {
      try {
        const fuseRes = fuse.search(qNorm, { limit });
        // fuseRes is array of {item,score}
        const mapped = fuseRes.map(r => (r.item as any).original as Course);
        setResults(mapped);
        setIsSearching(false);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
        setIsSearching(false);
      }
    } else {
      // fallback simple filter (if index not ready)
      const fallback = normalizedDocs
        .filter(d =>
          d.course_code_norm.includes(qNorm) ||
          d.course_name_norm.includes(qNorm) ||
          (d.lecturers && d.lecturers.includes(qNorm))
        )
        .slice(0, limit)
        .map(d => d.original);
      setResults(fallback);
      setIsSearching(false);
    }
  }, [debouncedQ, fuse, normalizedDocs, limit]);

  return {
    results,
    isSearching,
    indexReady,
  };
}
