import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("cash-flow", "cash-flow/layout.tsx", [
    index("cash-flow/cash-flow.tsx"),
    route("analysis", "cash-flow/cash-flow-analysis/cash-flow-analysis.tsx"),
  ]),
] satisfies RouteConfig;
