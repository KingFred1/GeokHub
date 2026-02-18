// "use client"
// import React from "react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import NavMain from "./nav-main";
// import { data } from "@/lib/constant";
// import NavFooter from "./nav-footer";

// type Props = {};

// const AppSidebar = (props: Props) => {
//   return (
//     <Sidebar collapsible="icon" className="max-w-[212px] bg-background-90">
//       <SidebarHeader className="pt-6 px-2 pb-0">
//         <SidebarMenuButton
//           size={"lg"}
//           className="data-[state=0pen]
//             : text-sidebar-foreground"
//         >
//           <div
//             className="flex aspect-square size-8 items-center 
//             justify-center rounded-lg text-sidebar-primary-foreground"
//           >
//             <Avatar className="h-10 w-10 rounded-full">
//               <AvatarImage src={"/logo.png"} alt={`iblogx-logo`} width={20} />
//               <AvatarFallback>iBlogX</AvatarFallback>
//             </Avatar>
//           </div>
//           <span className="truncate text-primary text-3xl font-semibold">
//             iBlogX
//           </span>
//         </SidebarMenuButton>
//       </SidebarHeader>
//       <SidebarContent className="px-2 mt-10 gap-y-6">
//         <NavMain items={data.navMain} />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavFooter />
//       </SidebarFooter>
//     </Sidebar>
//   );
// };

// export default AppSidebar;
