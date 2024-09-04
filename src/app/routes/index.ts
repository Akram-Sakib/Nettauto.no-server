import express from 'express';
// import { AcademicPrivateCustomerRoutes } from '../modules/PrivateCustomer/PrivateCustomer.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuctionRoutes } from '../modules/auction/auction.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BusinessCustomerRoutes } from '../modules/businessCustomer/businessCustomer.route';
import { PrivateCustomerRoutes } from '../modules/privateCustomer/privateCustomer.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/business-customer',
    route: BusinessCustomerRoutes,
  },
  {
    path: '/private-customer',
    route: PrivateCustomerRoutes,
  },
  {
    path: '/auctions',
    route: AuctionRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
