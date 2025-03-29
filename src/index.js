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
];
