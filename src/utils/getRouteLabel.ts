import { ROUTES } from "@/config/routes";

export function getRoute(pathname: string) {
  return ROUTES.find((route) => route.matcher(pathname));
}