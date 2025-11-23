import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("", "cash-flow/layout.tsx", [
    index("cash-flow/cash-flow.tsx"),
    route("analysis", "cash-flow/cash-flow-analysis/cash-flow-analysis.tsx"),
  ]),
  route("settings", "settings/layout.tsx", [index("settings/settings.tsx")]),
] satisfies RouteConfig;
