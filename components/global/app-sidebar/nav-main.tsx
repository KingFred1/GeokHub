// "use client";
// import {
//   SidebarGroup,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";
// import { ChevronDown } from "lucide-react";

// type NavItem = {
//   title: string;
//   url: string;
//   icon?: React.FC<React.SVGProps<SVGSVGElement>>;
//   items?: { title: string; url: string }[]; // Optional for categories
// };

// const NavMain = ({ items }: { items: NavItem[] }) => {
//   const pathname = usePathname();

//   return (
//     <SidebarGroup className="p-0">
//       <SidebarMenu>
//         {items.map((item) => (
//           <React.Fragment key={item.title}>
//             {/* Check if item has sub-items (i.e., "Categories") */}
//             {item.items ? (
//               <Collapsible defaultChecked className="group/collapsible">
//                 <SidebarMenuItem>
//                   <CollapsibleTrigger asChild>
//                     <SidebarMenuButton
//                       tooltip={item.title}
//                       className={`${pathname.includes(item.url) && "bg-muted"}`}
//                     >
//                       {item.icon && <item.icon size={24} className="text-xl" />}
//                       <span className="text-xl">{item.title}</span>
//                       <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
//                     </SidebarMenuButton>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent>
//                     <SidebarMenuSub>
//                       {item.items.map((subItem) => (
//                         <SidebarMenuSubItem key={subItem.title} asChild>
//                           <Link
//                             href={subItem.url}
//                             className={`flex text-sm text-muted-foreground gap-2 ${
//                               pathname === subItem.url ? "font-bold text-primary-90" : ""
//                             }`}
//                           >
//                             {subItem.icon && <subItem.icon className="text-lg mt-0.5 " />}
//                             <span className="text-lg font-semibold mt-0.5">{subItem.title}</span>
//                           </Link>
//                         </SidebarMenuSubItem>
//                       ))}
//                     </SidebarMenuSub>
//                   </CollapsibleContent>
//                 </SidebarMenuItem>
//               </Collapsible>
//             ) : (
//               <SidebarMenuItem>
//                 <SidebarMenuButton
//                   asChild
//                   tooltip={item.title}
//                   className={`text-lg ${
//                     item.url === "/"
//                       ? pathname === item.url
//                         ? "bg-muted" // Only apply when exactly "/"
//                         : ""
//                       : pathname.includes(item.url)
//                       ? "bg-muted"
//                       : ""
//                   }`}                >
//                   <Link
//                     href={item.url}
//                     className={`flex items-center gap-2 text-lg ${
//                         item.url === "/"
//                           ? pathname === item.url
//                             ? "font-bold"
//                             : ""
//                           : pathname.includes(item.url)
//                           ? "font-bold"
//                           : ""
//                       }`}                  >
//                     {item.icon  && <item.icon size={24} className="text-lg w-7 h-7" />}
//                     <span >{item.title}</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             )}
//           </React.Fragment>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// };

// export default NavMain;
