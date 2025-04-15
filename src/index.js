export default [
  {
    path: '/login',
    controller: () => import('./login/Controller'),
  },
  {
    path: '/student/home',
    controller: () => import('./student/Controller'),
  },
  {
    path: '/admin',
    controller: () => import('./admin/Controller'),
  },
  {
    path: '/announcement/exhibition',
    controller: () => import('./announcement/Controller'),
  },
  {
    path: '/announcement/editor',
    controller: () => import('./announcementEditor/Controller'),
  },
  {
    path: '/violationInfoReporting',
    controller: () => import('./violationInfoReporting/Controller'),
  },
];
