export type PhotographyStyle =
  | "dark_moody"
  | "bright_airy"
  | "editorial"
  | "documentary"
  | "fine_art"
  | "classic_timeless";

export type EventType =
  | "wedding"
  | "portrait"
  | "commercial"
  | "event"
  | "family"
  | "newborn";

export interface StyleOption {
  id: PhotographyStyle;
  label: string;
  description: string;
  image: string;
  gradient: string;
}

export interface IntakeFormData {
  clientName: string;
  clientEmail: string;
  eventType: EventType;
  selectedStyles: PhotographyStyle[];
  budget: number;
  eventDate: string;
  location: string;
  notes: string;
}

export interface MatchResult {
  photographer_name: string;
  match_score: number;
  styles_overlap: string[];
  available: boolean;
  message: string;
}

export interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  selectedStyles: string[];
  budget: number;
  eventDate: string;
  location: string | null;
  notes: string | null;
  matchScore: number | null;
  status: "NEW" | "QUALIFIED" | "CONTACTED" | "BOOKED" | "DECLINED";
  createdAt: string;
}
