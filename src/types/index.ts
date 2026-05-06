export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}