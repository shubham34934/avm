import { lazy } from "react";
import { USER_ROLES } from "../utils/constants";
// Import pages
const Home = lazy(() => import("../pages/Home/Home"));
const UserHome = lazy(() => import("../pages/UserHome/UserHome"));
const Brands = lazy(() => import("../pages/Brands/Brands"));
const Campaign = lazy(() => import("../pages/Campaign/Campaign"));
const CreateCampaign = lazy(() =>
  import("../pages/CreateCampaign/CreateCampaign")
);
const CreateSponsor = lazy(() =>
  import("../pages/CreateSponsor/CreateSponsor")
);
const CampaignDetails = lazy(() =>
  import("../pages/CampaignDetails/CampaignDetails")
);
const VideoPlayer = lazy(() => import("../pages/VideoPlayer/VideoPlayer"));
const Videos = lazy(() => import("../pages/Videos/Videos"));
const UploadVideo = lazy(() => import("../pages/UploadVideo/UploadVideo"));
const Users = lazy(() => import("../pages/Users/Users"));
const UserDetail = lazy(() => import("../pages/UserDetail/UserDetail"));
const AITools = lazy(() => import("../pages/AITools/AITools"));
const Unauthorized = lazy(() => import("../pages/Auth/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Logout = lazy(() => import("../pages/auth/Logout"));

// Authentication pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

export const routes = [
  {
    path: "/",
    component: Home,
    allowedRoles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.CREATOR,
    ],
  },
  {
    path: "/brands",
    component: Brands,
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    path: "/sponsor/create",
    component: CreateSponsor,
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    path: "/campaign",
    component: Campaign,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    path: "/campaign/create",
    component: CreateCampaign,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    path: "/campaign/:id",
    component: CampaignDetails,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    path: "/videos/:id",
    component: VideoPlayer,
    config: {
      hideFooter: true,
    },
    allowedRoles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.CREATOR,
    ],
  },
  {
    path: "/videos",
    component: Videos,
    allowedRoles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.CREATOR,
    ],
  },
  {
    path: "/uploadVideo",
    component: UploadVideo,
    allowedRoles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.CREATOR,
    ],
  },
  {
    path: "/uploadVideo/:id",
    component: UploadVideo,
    allowedRoles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.CREATOR,
    ],
  },
  {
    path: "/users",
    component: Users,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    path: "/users/:username",
    component: UserDetail,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    path: "/ai-tools",
    component: AITools,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
];

// Public routes (accessible without authentication)
export const publicRoutes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:token",
    component: ResetPassword,
  },
  {
    path: "/logout",
    component: Logout,
  },
];

// Special routes
export const specialRoutes = [
  {
    path: "/unauthorized",
    component: Unauthorized,
  },
  {
    path: "*",
    component: NotFound,
  },
];
