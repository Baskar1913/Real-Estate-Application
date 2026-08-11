import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" to="/">
      <span className="brand-icon"><Building2 size={22} /></span>
      {!compact && <span><strong>Real Estate</strong><small>Properties</small></span>}
    </Link>
  );
}

