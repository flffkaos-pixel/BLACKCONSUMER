export interface Report {
  id: string;
  created_at: string;
  name: string;
  gender: string;
  age_group: string | null;
  height: string | null;
  build: string;
  appearance: string | null;
  contact_info: string | null;
  vehicle_number: string | null;
  incident_at: string | null;
  location: string | null;
  damage_type: string | null;
  damage_amount: number | null;
  description: string;
  response_process: string | null;
  evidence_type: string | null;
  media_url: string | null;
  views: number;
  industry: string | null;
}
