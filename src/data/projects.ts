export type ProjectStatus = "Active" | "Pending" | "Sold";

export interface Project {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  description: string;
  image: string;
  images?: string[];
  featured?: boolean;
  overview?: string;
  highlights?: string[];
  specs?: { label: string; value: string }[];
}
