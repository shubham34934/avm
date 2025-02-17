// Import icons
import HomeIcon from '../assets/icons/home.svg';
import BrandsIcon from '../assets/icons/brands.svg';
import CampaignIcon from '../assets/icons/campaign.svg';
import UsersIcon from '../assets/icons/users.svg';
import AIToolsIcon from '../assets/icons/aitools.svg';
import PriceDistributionIcon from '../assets/icons/pricedistribution.svg';
import VideosIcon from '../assets/icons/videos.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import ReportsIcon from '../assets/icons/reports.svg';
import LogoutIcon from '../assets/icons/logout.svg';

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  BRAND_ADMIN: 'Brand Admin',
  END_USER: 'End User',
  CREATOR: 'Creator'
};

// Sidebar Navigation Items
export const SIDEBAR_ITEMS = [
  {
    label: 'Brands',
    path: '/brands',
    icon: BrandsIcon,
    roles: [USER_ROLES.SUPER_ADMIN]
  },
  {
    label: 'Campaign',
    path: '/campaign',
    icon: CampaignIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    label: 'Users',
    path: '/users',
    icon: UsersIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    label: 'AI tools',
    path: '/ai-tools',
    icon: AIToolsIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    label: 'Price Distributions',
    path: '/price-distributions',
    icon: PriceDistributionIcon,
    roles: [USER_ROLES.SUPER_ADMIN]
  },
  {
    label: 'Videos',
    path: '/videos',
    icon: VideosIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN, USER_ROLES.CREATOR]
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    id: 'logout',
    label: 'Logout',
    path: '/logout',
    icon: LogoutIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN, USER_ROLES.END_USER, USER_ROLES.CREATOR],
    position: 'bottom'
  }
];

// Footer Navigation Items
export const FOOTER_ITEMS = [
  {
    label: 'Home',
    path: '/',
    icon: HomeIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN, USER_ROLES.END_USER, USER_ROLES.CREATOR]
  },
  {
    label: 'Campaign',
    path: '/campaign',
    icon: CampaignIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    label: 'Videos',
    path: '/videos',
    icon: VideosIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN, USER_ROLES.CREATOR]
  },
  {
    label: 'AI tools',
    path: '/ai-tools',
    icon: AIToolsIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: ReportsIcon,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  }
];
