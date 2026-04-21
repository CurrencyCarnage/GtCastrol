"use client";

import { CalendarClock, MapPinned, SearchCheck } from "lucide-react";
import { useState } from "react";

import { LinkButton } from "@/components/ui";
import { cn } from "@/lib/utils";

type ToolKey = "finder" | "service" | "booking";

const tools: Array<{
  key: ToolKey;
  label: string;
  title: string;
  description: string;
  href: string;
  action: string;
  Icon: typeof SearchCheck;
}> = [
  {
    key: "finder",
    label: "Find product",
    title: "Start with your vehicle, then get the right Castrol product.",
    description: "A focused route for matching vehicle needs to approved oils, fluids, and product families.",
    href: "/finder",
    action: "Open product finder",
    Icon: SearchCheck,
  },
  {
    key: "service",
    label: "Find service",
    title: "See approved service locations near you.",
    description: "Use the service-center map to compare authorized locations and approved affiliate partners.",
    href: "/service-centers",
    action: "View service centers",
    Icon: MapPinned,
  },
  {
    key: "booking",
    label: "Book service",
    title: "Move from product choice to a service request.",
    description: "Choose a center, service type, date, and product context without browsing the whole catalogue first.",
    href: "/booking",
    action: "Book a service",
    Icon: CalendarClock,
  },
];

export function HomeToolsSwitcher() {
  const [activeKey, setActiveKey] = useState<ToolKey>("finder");
  const activeTool = tools.find((tool) => tool.key === activeKey) ?? tools[0];
  const ActiveIcon = activeTool.Icon;

  return (
    <div className="rounded-[2rem] border border-[rgba(30,42,35,0.12)] bg-white p-3 shadow-[0_18px_44px_rgba(30,42,35,0.08)] sm:p-4">
      <div className="grid gap-2 rounded-[1.35rem] bg-[var(--off-white)] p-1.5 sm:grid-cols-3">
        {tools.map(({ key, label, Icon }) => {
          const isActive = key === activeKey;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveKey(key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition",
                isActive
                  ? "bg-white text-[var(--castrol-green-deep)] shadow-[0_8px_20px_rgba(30,42,35,0.08)]"
                  : "text-[var(--muted-foreground)] hover:bg-white/70 hover:text-[var(--foreground)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.78fr_1fr] lg:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(180deg,var(--castrol-green),var(--castrol-green-deep))] text-white shadow-[0_18px_34px_rgba(12,107,52,0.24)]">
          <ActiveIcon className="h-9 w-9" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="max-w-3xl font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
              {activeTool.title}
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">{activeTool.description}</p>
          </div>

          <LinkButton href={activeTool.href} className="w-full justify-center sm:w-auto">
            {activeTool.action}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
