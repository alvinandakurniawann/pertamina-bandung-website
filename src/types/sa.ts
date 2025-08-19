export type LocationType = 'SPBU' | 'SPBE';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  services: string[];
  hours: string;
  phone: string;
}

export interface Region {
  id: string;
  name: string;
  color: string;
  spbuCount: number;
  spbeCount: number;
  locations: Location[];
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  services: string[];
  hours: string;
  phone: string;
  region_id?: string;
  created_at?: string;
  updated_at?: string;
}



