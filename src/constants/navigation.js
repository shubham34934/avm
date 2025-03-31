// Import icons
import HomeIcon from "../assets/icons/home.svg";
import BrandsIcon from "../assets/icons/brands.svg";
import CampaignIcon from "../assets/icons/campaign.svg";
import UsersIcon from "../assets/icons/users.svg";
import AIToolsIcon from "../assets/icons/aitools.svg";
import PriceDistributionIcon from "../assets/icons/pricedistribution.svg";
import VideosIcon from "../assets/icons/videos.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import ReportsIcon from "../assets/icons/reports.svg";
import LogoutIcon from "../assets/icons/logout.svg";
import { USER_ROLES } from "../utils/constants";

// User roles

// Sidebar Navigation Items
export const SIDEBAR_ITEMS = [
  {
    label: "Brands",
    path: "/brands",
    icon: BrandsIcon,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Campaign",
    path: "/campaign",
    icon: CampaignIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "Users",
    path: "/users",
    icon: UsersIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "AI tools",
    path: "/ai-tools",
    icon: AIToolsIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "Price Distributions",
    path: "/price-distributions",
    icon: PriceDistributionIcon,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Videos",
    path: "/videos",
    icon: VideosIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CREATOR],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: SettingsIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
];

// Footer Navigation Items
export const FOOTER_ITEMS = [
  {
    label: "Home",
    path: "/",
    icon: HomeIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CREATOR],
  },
  {
    label: "Campaign",
    path: "/campaign",
    icon: CampaignIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "Videos",
    path: "/videos",
    icon: VideosIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CREATOR],
  },
  {
    label: "AI tools",
    path: "/ai-tools",
    icon: AIToolsIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: ReportsIcon,
    roles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
];
