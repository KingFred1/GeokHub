import NextAuth from "next-auth";
import { count } from 'drizzle-orm';

declare module "next-auth" {
  interface Session {
    users: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

interface AuthCredentials {
    name: string;
    email: string;
    password: string;
}



export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Score {
  winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
  duration?: 'REGULAR' | 'EXTRA_TIME' | 'PENALTIES_SHOOTOUT';
  fullTime: {
    home?: number;
    away?: number;  
  };
  halfTime?: {
    home?: number;
    away?: number;
  };
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: 'FT' | 'HT' | 'LIVE' | 'NS' | 'TBD' | 'PST' | 'CANC';
      elapsed?: number;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round?: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score?: {
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface MatchesResponse {
  matches: Match[];
}

export interface CompetitionResponse {
  competitions: Competition[];
  count: number;
  filters: Record<string, unknown>;
}

// types/category
export interface Category {
  _id: string;
  title: string;
  slug: string;
  parent?: {
    title: string;
    slug: string;
  };
}

export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  _createdAt: string;
  author: {
    name: string;
    image?: any;
  };
  views?: number;
  categories?: Category[];
  mainImage?: any;
  body?: any;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// types/sports
export interface SportCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage?: any;
  excerpt?: string;
  _createdAt: string;
  author: {
    name: string;
    image?: any;
  };
  categories?: SportCategory[];
}