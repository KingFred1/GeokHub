"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavLink {
  title: string;
  href: string;
}

interface NavMenu {
  title: string;
  links: NavLink[];
}

const navlinks: NavMenu[] = [
  {
    title: "Technology",
    links: [
      { title: "Tech News", href: "/technology/tech-news" },
      { title: "Artificial Intelligence", href: "/technology/ai" },
      { title: "Cybersecurity", href: "/technology/cybersecurity" },
      { title: "Gadgets", href: "/technology/gadgets" },
    ],
  },
];

export function BlogNavigationMenu() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted
  if (!isMounted) {
    return (
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="flex gap-4">
          <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
          <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
          <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex flex-nowrap justify-start md:justify-center items-center overflow-x-auto py-2 md:overflow-visible">
        {/* Home */}
        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className={cn(
                navigationMenuTriggerStyle(),
                "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2"
              )}
            >
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink asChild>
            <Link
              href="/news"
              className={cn(
                navigationMenuTriggerStyle(),
                "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2"
              )}
            >
              News
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Dynamic Dropdowns */}
        {navlinks.map((menu) => (
          <NavigationMenuItem key={menu.title} className="flex-shrink-0">
            <NavigationMenuTrigger className="text-sm font-medium px-3 py-2">
              {menu.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] lg:grid-cols-3">
                {menu.links.map((link) => (
                  <ListItem key={link.title} href={link.href} title={link.title}>
                    {`Explore ${link.title} under ${menu.title}.`}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        {/* Other links */}
        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink asChild>
            <Link
              href="/lifestyle/category/lifestyle"
              className={cn(
                navigationMenuTriggerStyle(),
                "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2"
              )}
            >
              Lifestyle
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink asChild>
            <Link
              href="/about"
              className={cn(
                navigationMenuTriggerStyle(),
                "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2"
              )}
            >
              About Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink asChild>
            <Link
              href="/contact"
              className={cn(
                navigationMenuTriggerStyle(),
                "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2"
              )}
            >
              Contact Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ title, href, children, ...props }, ref) => {
    return (
      <li ref={ref} {...props}>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default BlogNavigationMenu;