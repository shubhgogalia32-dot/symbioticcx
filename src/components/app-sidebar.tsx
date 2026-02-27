import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Cpu, BarChart3, Settings, ShieldAlert, LifeBuoy, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar className="border-r border-white/5 bg-[#09090b]">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldAlert className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">SymbioticCX</span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Centaur-OS v1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest px-4 py-2">Mission Control</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                <Link to="/" className="flex items-center gap-3">
                  <LayoutGrid className="size-4" /> 
                  <span className="font-mono text-xs uppercase tracking-tight">Session Queue</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith("/cockpit")}>
                <Link to="/cockpit/active" className="flex items-center gap-3">
                  <Cpu className="size-4" /> 
                  <span className="font-mono text-xs uppercase tracking-tight">Active Cockpit</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/analytics"}>
                <Link to="/analytics" className="flex items-center gap-3">
                  <BarChart3 className="size-4" /> 
                  <span className="font-mono text-xs uppercase tracking-tight">Strategic Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/onepager"}>
                <Link to="/onepager" className="flex items-center gap-3">
                  <FileText className="size-4" />
                  <span className="font-mono text-xs uppercase tracking-tight">Executive Report</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="bg-white/5" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest px-4 py-2">Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3 opacity-60">
                  <Settings className="size-4" /> 
                  <span className="font-mono text-xs uppercase tracking-tight">System Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3 opacity-60">
                  <LifeBuoy className="size-4" /> 
                  <span className="font-mono text-xs uppercase tracking-tight">Help Center</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5 bg-black/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase text-muted-foreground">Critical Sessions</span>
            <span className="text-[9px] font-mono text-red-500 font-bold">1 ACTIVE</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[30%]" />
          </div>
          <p className="text-[8px] font-mono text-muted-foreground/60 leading-tight">
            SYMBOTIC-CX // SECURE UPLINK ESTABLISHED
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}