import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('cash-flow/cash-flow.tsx'),
  route(
    'cash-flow/analytics',
    'cash-flow/cash-flow-tab/cash-flow-analytics/cash-flow-analytics.tsx'
  ),
  route(
    'cash-flow/net-worth/analytics',
    'cash-flow/net-worth-tab/net-worth-analytics/net-worth-analytics.tsx'
  ),
  route('settings', 'settings/settings.tsx'),
] satisfies RouteConfig;
