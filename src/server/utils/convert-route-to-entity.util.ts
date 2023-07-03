const mapping: Record<string, string> = {
  bills: 'bill',
  items: 'item',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
