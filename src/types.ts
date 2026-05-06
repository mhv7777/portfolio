export interface Credit {
  role: string; // e.g. "Director"
  name: string; // e.g. "Miguel Verduzco"
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  link?: string;
  videoUrl?: string;
  category?: string;
  role?: string;
  assets?: any[];
  credits?: Credit[]; // <-- added
  createdAt?: Date | string;
  updatedAt?: Date | string;
}