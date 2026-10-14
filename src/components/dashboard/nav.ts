import {
  Analytics01Icon,
  AddSquareIcon,
  ChartLineData01Icon,
  DashboardSquare01Icon,
  HelpCircleIcon,
  Invoice01Icon,
  MinusSignSquareIcon,
  Rocket01Icon,
  Settings01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import type { IconType } from "@/components/ui/icon";
import type { Mode } from "@/lib/data";

export type NavItem = {
  id: string;
  label: string;
  icon: IconType;
  badge?: number;
  target?: string; // section id to scroll to
  mode?: Mode;
  soon?: boolean;
};

export const NAV_GROUPS: { id: string; label: string; items: NavItem[] }[] = [
  {
    id: "main",
    label: "Main Menu",
    items: [
      { id: "dashboard", label: "Dashboard", icon: DashboardSquare01Icon, target: "top" },
      { id: "trade", label: "Trade", icon: ChartLineData01Icon, target: "chart" },
      { id: "wallets", label: "Wallets", icon: Wallet01Icon, soon: true },
      { id: "markets", label: "Markets", icon: Analytics01Icon, badge: 6, target: "overview" },
      { id: "transactions", label: "Transactions", icon: Invoice01Icon, target: "transactions" },
    ],
  },
  {
    id: "trading",
    label: "Trading",
    items: [
      { id: "spot", label: "Spot Trading", icon: Rocket01Icon, target: "chart" },
      { id: "buy", label: "Buy Crypto", icon: AddSquareIcon, target: "trade-panel", mode: "buy" },
      { id: "sell", label: "Sell Crypto", icon: MinusSignSquareIcon, target: "trade-panel", mode: "sell" },
    ],
  },
  {
    id: "general",
    label: "General",
    items: [
      { id: "help", label: "Help Center", icon: HelpCircleIcon, soon: true },
      { id: "settings", label: "Settings", icon: Settings01Icon, soon: true },
    ],
  },
];
