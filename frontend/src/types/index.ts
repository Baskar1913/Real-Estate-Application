export type Role = "user" | "admin";

export interface AuthUser { id: number; name: string; email: string; role: Role }
export interface AuthResponse { message: string; token: string; user: AuthUser }
export interface LoginData { email: string; password: string; role: Role }
export interface RegisterData { name: string; email: string; password: string; confirm_password: string; role: Role; admin_registration_code?: string }

export interface NamedRecord { id: number; name: string; app_id: number; [key: string]: unknown }
export interface PropertyRecord {
  id: number;
  title: string;
  banner?: string | null;
  price: string;
  location: number;
  location_name?: string;
  category: number;
  category_name?: string;
  subcategory: number;
  subcategory_name?: string;
  no_of_bedrooms: number;
  no_of_washrooms: number;
  area: string;
  description: string;
  featured?: boolean;
  status?: string;
  app_id: number;
  [key: string]: unknown;
}

export interface AboutRecord {
  id: number;
  banner?: string | null;
  image?: string | null;
  title1: string;
  title2: string;
  description: string;
  app_id: number;
  [key: string]: unknown;
}

export interface ContactInfoRecord {
  id: number;
  phone: string;
  email: string;
  address: string;
  map_url?: string;
  app_id: number;
}
