import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('cash-flow/cash-flow.tsx'),
  route('analytics', 'cash-flow/cash-flow-analytics/cash-flow-analytics.tsx'),
  route('settings', 'settings/settings.tsx'),
] satisfies RouteConfig;
