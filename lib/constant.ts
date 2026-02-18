import { Car, DollarSign, Flame, Folder, Home, Hospital, Laptop, Music, Newspaper } from "lucide-react";

export const data = {
  user: {
    name: "Shadcn",
    email: "m@example.com",
    avatar: "/avatar/shadcn.jpg",
  },

  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Latest News",
      url: "/latest-news",
      icon: Newspaper,
    },
    {
      title: "Trending",
      url: "/trending",
      icon: Flame,
    },
    {
      title: "Topics",
      url: "/topics",
      icon: Folder,
      items: [
        { title: "Technology", url: "/topics/technology", icon: Laptop },
        { title: "Business", url: "/topics/business", icon: DollarSign },
        { title: "Health", url: "/topics/health", icon: Hospital },
        { title: "Entertainment", url: "/topics/entertainment", icon: Music },
        { title: "Sports", url: "/topics/sports", icon: Car },
      ],
    },
  ],
};

export const FIELD_NAMES = {
  name: "Full name",
    email: "Email",
    password: "Password",
}

  export const FIELD_TYPES = {
    name: "text",
    email: "email",
    password: "password",
}