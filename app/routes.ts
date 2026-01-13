import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  route('sign-in/*', 'sign-in.tsx', [route('create/sso-callback', 'sign-in/sso-callback.tsx')]),
  index('home/home.tsx'),

  route('cash-flow', 'cash-flow/cash-flow.tsx'),
  route(
    'cash-flow/analytics',
    'cash-flow/cash-flow-tab/cash-flow-analytics/cash-flow-analytics.tsx'
  ),
  route(
    'cash-flow/net-worth/analytics',
    'cash-flow/net-worth-tab/net-worth-analytics/net-worth-analytics.tsx'
  ),
  route('settings', 'settings/settings.tsx'),
  route('portfolio/coming-soon', 'cash-flow/portfolio-more-pages.tsx'),
  route('analytics/coming-soon', 'cash-flow/analytics-more-pages.tsx'),
  route('support/coming-soon', 'cash-flow/support-more-pages.tsx'),
] satisfies RouteConfig;
