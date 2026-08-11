import { ArrowRight, BadgeCheck, Building, Headphones, Search } from "lucide-react";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard";
import api, { mediaUrl } from "../../services/api";
import type { AboutRecord, NamedRecord, PropertyRecord } from "../../types";

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [projects, setProjects] = useState<PropertyRecord[]>([]);
  const [locations, setLocations] = useState<NamedRecord[]>([]);
  const [categories, setCategories] = useState<NamedRecord[]>([]);
  const [subcategories, setSubcategories] = useState<NamedRecord[]>([]);
  const [about, setAbout] = useState<AboutRecord | null>(null);
  const [filter, setFilter] = useState({ location: "", category: "", subcategory: "" });
  const navigate = useNavigate();

  useEffect(() => {
    void Promise.all([
      api.get<PropertyRecord[]>("/properties/"),
      api.get<PropertyRecord[]>("/projects/"),
      api.get<NamedRecord[]>("/locations/"),
      api.get<NamedRecord[]>("/categories/"),
      api.get<NamedRecord[]>("/subcategories/"),
      api.get<AboutRecord[]>("/about-us/"),
    ]).then(([propertyResponse, projectResponse, locationResponse, categoryResponse, subcategoryResponse, aboutResponse]) => {
      setProperties(propertyResponse.data);
      setProjects(projectResponse.data);
      setLocations(locationResponse.data);
      setCategories(categoryResponse.data);
      setSubcategories(subcategoryResponse.data);
      setAbout(aboutResponse.data[0] || null);
    });
  }, []);

  const availableSubcategories = useMemo(
    () => subcategories.filter((item) => !filter.category || String(item.category) === filter.category),
    [filter.category, subcategories],
  );

  const search = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/properties?location=${filter.location}&category=${filter.category}&subcategory=${filter.subcategory}`);
  };

  return (
    <>
      <section className="hero" style={about?.banner ? { backgroundImage: `linear-gradient(90deg,#0b2016ed 0%,#173d25cc 48%,#173d2569),url(${mediaUrl(about.banner)})` } : undefined}>
        <div className="container hero-content">
          <span className="eyebrow">Your trusted property partner</span>
          <h1>Discover a place<br /><em>you'll love to live.</em></h1>
          <p>Explore verified residential and commercial properties in the locations that matter to you.</p>
          <div className="hero-buttons">
            <Link className="gold-button" to="/properties">Explore properties <ArrowRight /></Link>
            <Link className="outline-button" to="/contact">Talk to an expert</Link>
          </div>
        </div>
      </section>

      <form className="search-panel search-panel-expanded container" onSubmit={search}>
        <label>Location<select value={filter.location} onChange={(event) => setFilter({ ...filter, location: event.target.value })}><option value="">All locations</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Category<select value={filter.category} onChange={(event) => setFilter({ ...filter, category: event.target.value, subcategory: "" })}><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Subcategory<select value={filter.subcategory} onChange={(event) => setFilter({ ...filter, subcategory: event.target.value })} disabled={!filter.category}><option value="">{filter.category ? "All subcategories" : "Choose category first"}</option>{availableSubcategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <button className="gold-button"><Search />Search property</button>
      </form>

      <section className="category-browser container">
        <span className="eyebrow">Browse by category</span>
        <div className="category-chips">
          {categories.map((category) => (
            <button key={category.id} onClick={() => navigate(`/properties?category=${category.id}`)}>
              <Building />
              <strong>{category.name}</strong>
              <small>{subcategories.filter((item) => String(item.category) === String(category.id)).map((item) => item.name).join(" · ") || "View properties"}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><span className="eyebrow">Handpicked homes</span><h2>Featured Properties</h2><p>Explore our latest premium properties.</p></div>
        <div className="cards-grid">{properties.slice(0, 3).map((item) => <PropertyCard key={item.id} item={item} kind="properties" />)}</div>
        {!properties.length && <Empty text="No properties have been added yet." />}
        <div className="center"><Link className="text-link" to="/properties">View all properties <ArrowRight /></Link></div>
      </section>

      <section className="why"><div className="container"><div className="section-heading light"><span className="eyebrow">Why choose us</span><h2>Property guidance you can trust</h2></div><div className="benefit-grid"><article><BadgeCheck /><h3>Verified listings</h3><p>Every listed property is checked for quality and accuracy.</p></article><article><Building /><h3>Curated portfolio</h3><p>Homes and projects selected for modern buyers and investors.</p></article><article><Headphones /><h3>Dedicated support</h3><p>Clear guidance from discovery through final decision.</p></article></div></div></section>

      <section className="section container"><div className="section-heading"><span className="eyebrow">Premium developments</span><h2>Residential & Commercial Projects</h2></div><div className="cards-grid">{projects.slice(0, 3).map((item) => <PropertyCard key={item.id} item={item} kind="projects" />)}</div>{!projects.length && <Empty text="No projects have been added yet." />}</section>
    </>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="empty-state"><Building /><p>{text}</p></div>;
}
