"use client";

import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { useState, useEffect } from "react";
import ThemeSwitcher from "../mode-toggle";
import { useSession, Session } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { BlogNavigationMenu } from "./navbar";
import {
  SearchIcon,
  MenuIcon,
  XIcon,
  HomeIcon,
  NewspaperIcon,
  MailIcon,
  InfoIcon,
  ContactIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  Cpu,
  HeartIcon,
} from "lucide-react";
import SearchBar from "./upper-info-search";
import { motion, AnimatePresence } from "framer-motion";
import { NewsletterForm } from "../Newsletter-form";

interface UpperInfoBarProps {
  searchParams?: { query?: string };
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavCategory {
  title: string;
  links: { title: string; href: string }[];
}

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const NavMenu = ({ isOpen, onClose, session }: NavMenuProps) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted
  if (!isMounted) {
    return null;
  }

  const mainNavItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="w-5 h-5 cursor-pointer" />,
    },
    {
      name: "Technology",
      href: "/technology/tech-news",
      icon: <Cpu className="w-5 h-5 cursor-pointer" />,
    },
    {
      name: "Lifestyle",
      href: "/lifestyle/category/lifestyle",
      icon: <HeartIcon className="w-5 h-5 cursor-pointer" />,
    },
    {
      name: "Newsletter",
      href: "/newsletter",
      icon: <MailIcon className="w-5 h-5 cursor-pointer" />,
    },
    {
      name: "About",
      href: "/about",
      icon: <InfoIcon className="w-5 h-5 cursor-pointer" />,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <ContactIcon className="w-5 h-5 cursor-pointer" />,
    },
  ];

  const userNavItems: NavItem[] = [
    {
      name: "Profile",
      href: "/profile",
      icon: <UserIcon className="w-5 h-5 cursor-pointer" />,
    },
    {
      name: "Sign Out",
      href: "/api/auth/signout",
      icon: <LogOutIcon className="w-5 h-5 cursor-pointer" />,
    },
  ];

  const navCategories: NavCategory[] = [
    {
      title: "News",
      links: [
        { title: "Latest News", href: "/news" },
        // { title: "Business", href: "/news/business" },
        // { title: "Global News", href: "/news/world" },
      ],
    },
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

  const getCategoryIcon = (title: string) => {
    switch (title) {
      case "Technology":
        return <Cpu className="w-5 h-5" />;
      default:
        return <NewspaperIcon className="w-5 h-5" />;
    }
  };

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  const menuVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300 },
    },
    closed: {
      opacity: 0,
      x: 20,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="absolute right-0 top-0 h-full w-80 bg-card shadow-xl border-l border-gray-200 dark:border-gray-800 overflow-y-auto"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h2 className="text-xl font-semibold cursor-pointer">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <nav className="p-4">
                  <motion.ul className="space-y-2">
                    {mainNavItems.map((item) => (
                      <motion.li key={item.name} variants={itemVariants}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={onClose}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Categories
                    </h3>
                    <ul className="space-y-2">
                      {navCategories.map((category) => (
                        <motion.li key={category.title} variants={itemVariants}>
                          <button
                            onClick={() => toggleCategory(category.title)}
                            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {getCategoryIcon(category.title)}
                              <span>{category.title}</span>
                            </div>
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform ${openCategory === category.title ? "rotate-180" : ""}`}
                            />
                          </button>

                          <AnimatePresence>
                            {openCategory === category.title && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-9 mt-1 space-y-1"
                              >
                                {category.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                      onClick={onClose}
                                    >
                                      <span>{link.title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {session?.user && (
                    <motion.div
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="px-3 text-sm font-medium cursor-pointer text-gray-500 dark:text-gray-400 mb-2">
                        Account
                      </h3>
                      <ul className="space-y-2">
                        {userNavItems.map((item) => (
                          <motion.li key={item.name} variants={itemVariants}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={onClose}
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </nav>
              </div>

              <motion.div
                className="p-4 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Newsletter Form */}
                {/* <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <NewsletterForm variant="minimal" />
                </div> */}

                {/* Theme Switcher (only visible in toggle menu) */}
                <div className="p-4 flex items-center justify-center">
                  <ThemeSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UpperInfoBar: React.FC<UpperInfoBarProps> = ({ searchParams = {} }) => {
  const query = searchParams.query || "";
  const { data: session } = useSession();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client mounting

  useEffect(() => {
    setIsClient(true); // Mark as client-mounted
    
    const checkIfMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setShowDesktopSearch(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    const handleScroll = () => {
      if (!isMobile) return;

      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setIsScrolled(currentScrollY > lastScrollY && currentScrollY > 50);
      } else {
        setIsScrolled(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile, isClient]);

  // Don't render anything on server - return skeleton
  if (!isClient) {
    return (
      <header className="sticky top-0 z-[50] w-full">
        <div className="w-full flex flex-col items-center gap-2 bg-white/90 dark:bg-card backdrop-blur-md px-4 md:px-10 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="w-full flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <Separator
                orientation="vertical"
                className="h-6 bg-gradient-to-b from-blue-500 to-teal-400"
              />
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse hidden sm:block"></div>
              <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`sticky top-0 z-[50] w-full flex flex-col transition-transform duration-300 ease-out ${isScrolled ? "-translate-y-[calc(100%-60px)]" : "translate-y-0"}`}
      >
        <div
          className={`w-full flex flex-col items-center gap-2 bg-white/90 dark:bg-card backdrop-blur-md px-4 md:px-10 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${isMobile && isScrolled ? "opacity-0" : "opacity-100"}`}
        >
          <div className="w-full flex items-center justify-between gap-4 py-3 ">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </motion.button>

              <Separator
                orientation="vertical"
                className="h-6 bg-gradient-to-b from-blue-500 to-teal-400"
              />

              <Link
                href="/"
                className="truncate cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 bg-[length:200%_auto] animate-gradient-flow md:text-3xl text-xl font-bold [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
              >
                GeokHub
              </Link>
            </div>

            {/* Middle: NavLinks (Desktop Only) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <BlogNavigationMenu />
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop search toggle button */}
              <button
                className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowDesktopSearch(!showDesktopSearch)}
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Mobile search toggle button */}
              <button
                className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              <div className="p-2 flex items-center justify-center hidden sm:flex">
                <ThemeSwitcher />
              </div>

              {session?.user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <Avatar>
                      <AvatarFallback>
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          session.user.name?.charAt(0)
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/sign-in"
                    className="px-2.5 py-1.5 rounded-md border border-gray-300/40 bg-card dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop search bar (appears below when toggled) */}
          {showDesktopSearch && (
            <div className="w-full hidden sm:flex mb-3">
              <SearchBar
                query={query}
                onClose={() => setShowDesktopSearch(false)}
              />
            </div>
          )}

          {/* Mobile search bar */}
          {showMobileSearch && (
            <div className="w-full sm:hidden mb-3">
              <SearchBar
                query={query}
                onClose={() => setShowMobileSearch(false)}
              />
            </div>
          )}
        </div>
      </header>

      <NavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        session={session}
      />
    </>
  );
};

export default UpperInfoBar;