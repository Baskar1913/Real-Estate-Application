import { Filter, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard";
import api from "../../services/api";
import type { NamedRecord, PropertyRecord } from "../../types";

export default function ListPage({ kind }: { kind: "properties" | "projects" }) {
  const [params] = useSearchParams();
  const [items, setItems] = useState<PropertyRecord[]>([]);
  const [locations, setLocations] = useState<NamedRecord[]>([]);
  const [categories, setCategories] = useState<NamedRecord[]>([]);
  const [subcategories, setSubcategories] = useState<NamedRecord[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(params.get("location") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [subcategory, setSubcategory] = useState(params.get("subcategory") || "");

  const load = useCallback(() => api.get<PropertyRecord[]>(`/${kind}/`).then((response) => setItems(response.data)), [kind]);

  useEffect(() => {
    void load();
    void Promise.all([
      api.get<NamedRecord[]>("/locations/"),
      api.get<NamedRecord[]>("/categories/"),
      api.get<NamedRecord[]>("/subcategories/"),
    ]).then(([locationResponse, categoryResponse, subcategoryResponse]) => {
      setLocations(locationResponse.data);
      setCategories(categoryResponse.data);
      setSubcategories(subcategoryResponse.data);
    });
  }, [load]);

  const availableSubcategories = useMemo(
    () => subcategories.filter((item) => !category || String(item.category) === category),
    [category, subcategories],
  );

  const filtered = useMemo(
    () => items.filter((item) =>
      (!query || item.title.toLowerCase().includes(query.toLowerCase())) &&
      (!location || String(item.location) === location) &&
      (!category || String(item.category) === category) &&
      (!subcategory || String(item.subcategory) === subcategory)),
    [category, items, location, query, subcategory],
  );

  const title = kind === "properties" ? "Properties" : "Projects";

  return (
    <>
      <section className={`page-banner ${kind}-page-banner`}><div className="container"><span className="eyebrow">Browse portfolio</span><h1>{title}</h1><p>Explore our latest residential and commercial opportunities.</p></div></section>
      <section className="section container listing-layout">
        <aside className="filters">
          <h3><Filter />Filter {title}</h3>
          <label>Search<span className="search-input"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or keyword" /></span></label>
          <label>Location<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">All locations</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory(""); }}><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Subcategory<select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} disabled={!category}><option value="">{category ? "All subcategories" : "Choose category first"}</option>{availableSubcategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <button className="clear-button" onClick={() => { setQuery(""); setLocation(""); setCategory(""); setSubcategory(""); }}>Clear filters</button>
        </aside>
        <div><p className="result-count">Showing {filtered.length} {title.toLowerCase()}</p><div className="cards-grid listing-cards">{filtered.map((item) => <PropertyCard key={item.id} item={item} kind={kind} onChanged={() => void load()} />)}</div>{!filtered.length && <div className="empty-state"><p>No matching {title.toLowerCase()} found.</p></div>}</div>
      </section>
    </>
  );
}
