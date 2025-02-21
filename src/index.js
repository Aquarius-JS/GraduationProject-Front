export default [
  {
    path: '/login',
    controller: () => import('./login/Controller'),
  },
  {
    path: '/student/home',
    controller: () => import('./student/Controller'),
  },
];
