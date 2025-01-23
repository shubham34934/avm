import { lazy } from 'react';
import { USER_ROLES } from '../constants/navigation';

// Import pages
const Home = lazy(() => import('../pages/Home/Home'));
const Brands = lazy(() => import('../pages/Brands/Brands'));
const Campaign = lazy(() => import('../pages/Campaign/Campaign'));
const Videos = lazy(() => import('../pages/Videos/Videos'));
const Users = lazy(() => import('../pages/Users'));
const AITools = lazy(() => import('../pages/AITools'));
// import PriceDistributions from '../pages/PriceDistributions';
// import Settings from '../pages/Settings';
// import Reports from '../pages/Reports';
const Unauthorized = lazy(() => import('../pages/Auth/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));

export const routes = [
  {
    path: '/',
    component: Home,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN, USER_ROLES.END_USER, USER_ROLES.CREATOR]
  },
  {
    path: '/brands',
    component: Brands,
    allowedRoles: [USER_ROLES.SUPER_ADMIN]
  },
  {
    path: '/campaign',
    component: Campaign,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    path: '/videos',
    component: Videos,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN, USER_ROLES.END_USER, USER_ROLES.CREATOR]
  },
  {
    path: '/ai-tools',
    component: AITools,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  {
    path: '/users',
    component: Users,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  },
  // {
  //   path: '/price-distributions',
  //   component: PriceDistributions,
  //   allowedRoles: [USER_ROLES.SUPER_ADMIN]
  // },
  // {
  //   path: '/settings',
  //   component: Settings,
  //   allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  // },
  // {
  //   path: '/reports',
  //   component: Reports,
  //   allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.BRAND_ADMIN]
  // }
];

// Public routes (accessible without authentication)
export const publicRoutes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/forgot-password',
    component: ForgotPassword
  }
];

// Special routes
export const specialRoutes = [
  {
    path: '/unauthorized',
    component: Unauthorized
  },
  {
    path: '*',
    component: NotFound
  }
];
