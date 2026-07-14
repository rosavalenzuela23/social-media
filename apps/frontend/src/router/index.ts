import ProfileService from '@/services/profile.service.ts';
import { createRouter, createWebHistory, type RouteLocationNormalizedGeneric } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/auth',
      alias: '/auth',
      children: [
        {
          path: 'login',
          alias: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          alias: 'register',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/onboarding',
      alias: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/onboarding/OnBoarding.vue'),
    },
    {
      path: '/feed',
      alias: '/feed',
      name: 'feed',
      component: () => import('../views/FeedView.vue'),
    },
    {
      path: '/profile/:profileId',
      alias: '/profile/:profileId',
      component: () => import('../views/Profile.vue'),
    },
    { path: '/:pathMatch(.*)*', component: () => import('../views/NotFoundPage.vue') },
  ],
});

const profileGuard = async (to: RouteLocationNormalizedGeneric) => {
  const authRoutes = ['login', 'register'];

  if (authRoutes.includes(to.name as string)) {
    return;
  }

  const profileService = ProfileService.getInstance();

  try {
    const profile = await profileService.getMyProfile();

    if (!profile && to.name !== 'onboarding') {
      return {
        name: 'onboarding',
      };
    }

    if (profile && (to.name === 'home' || to.name === 'onboarding')) {
      return {
        name: 'feed',
      };
    }
  } catch {
    if (to.name !== 'home') {
      return {
        name: 'home',
      };
    }
  }
};

router.beforeEach(profileGuard);

export default router;
