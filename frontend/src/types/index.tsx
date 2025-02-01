export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Photo {
  _id: string;
  title: string;
  caption: string;
  image_url: string;
  user: string | User;
  votes: number;
  created_at: string;
}

export interface Exhibition {
  _id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  start_date: string;
  end_date: string;
  photos: { image: Photo; selected: boolean }[];
  status: "upcoming" | "active" | "past";
  created_at: string;
}

export interface ExhibitionPhoto {
  id: string;
  exhibition_id: string;
  photo_id: string;
  selected: boolean;
  created_at: string;
}
