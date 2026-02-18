import { client } from "@/sanity/lib/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => 
  name
    .split(" ") // Split the full name into an array of words
    .map((word) => word[0]) // Extract the first letter of each word
    .join("") // Join the letters to form the initials
    .toUpperCase() // Convert the result to uppercase
    .slice(0, 2); // Limit the initials to the first two characters



    export const fetchPostFromSanity = async (postId: string) => {
      const query = `*[_type == "post" && _id == $postId][0]`;
      const params = { postId };
      const post = await client.fetch(query, params);
      return post;
    };
    