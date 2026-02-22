
"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";




import { Sun, Moon, Laptop } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";


const ThemeSwitcher = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Show the actual applied theme (system, light, or dark)
  const current = theme === "light" ? resolvedTheme : theme;

  const options = [
    {
      key: "system",
      label: "System",
      icon: <Laptop className="w-4 h-4 mr-2" />,
    },
    {
      key: "light",
      label: "Light",
      icon: <Sun className="w-4 h-4 mr-2" />,
    },
    {
      key: "dark",
      label: "Dark",
      icon: <Moon className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none">
        {current === "light" && <Sun className="w-4 h-4" />}
        {current === "dark" && <Moon className="w-4 h-4" />}
        {current === "system" && <Laptop className="w-4 h-4" />}
        <span className="capitalize">{current}</span>
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((opt) => (
            <Menu.Item key={opt.key}>
              {({ active }) => (
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${theme === opt.key ? "bg-primary text-white" : active ? "bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-200"}`}
                  onClick={() => setTheme(opt.key)}
                  role="option"
                  aria-selected={theme === opt.key}
                >
                  {opt.icon} {opt.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ThemeSwitcher;
