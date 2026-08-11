import { Bath, BedDouble, MapPin, Maximize2, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import api, { mediaUrl } from "../services/api";
import type { PropertyRecord } from "../types";

export default function PropertyCard({ item, kind, onChanged }: { item: PropertyRecord; kind: "properties" | "projects"; onChanged?: () => void }) {
  const { isAdmin } = useAuth();
  const remove = async () => {
    const result = await Swal.fire({ title: `Delete ${item.title}?`, text: "This cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonColor: "#b42318" });
    if (!result.isConfirmed) return;
    await api.delete(`/${kind}/${item.id}/`);
    await Swal.fire("Deleted", "The record was deleted.", "success");
    onChanged?.();
  };
  return (
    <article className="property-card">
      <div className="card-image"><img src={mediaUrl(item.banner)} alt={item.title}/><span>{item.status || item.subcategory_name || item.category_name || "Property"}</span></div>
      <div className="card-body">
        <h3>{item.title}</h3><p className="property-taxonomy">{[item.category_name, item.subcategory_name].filter(Boolean).join(" / ")}</p><p className="location"><MapPin size={14}/>{item.location_name || "Prime location"}</p>
        <strong className="price">₹{Number(item.price).toLocaleString("en-IN")}</strong>
        <div className="features"><span><BedDouble size={15}/>{item.no_of_bedrooms} Beds</span><span><Bath size={15}/>{item.no_of_washrooms} Baths</span><span><Maximize2 size={15}/>{item.area} Sq.ft</span></div>
        <div className="card-actions"><Link className="gold-button" to={`/${kind}/${item.id}`}>View details</Link>{isAdmin && <><Link className="icon-button edit" to={`/manage/${kind}/${item.id}`}><Pencil size={16}/></Link><button className="icon-button delete" onClick={() => void remove()}><Trash2 size={16}/></button></>}</div>
      </div>
    </article>
  );
}
