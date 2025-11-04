export enum Action {
  READ = 'read',
  WRITE = 'write',
}

export enum Entity {
  CONFIG = 'config',
  PAGE = 'page',
}

export const enforce = (
  token: string,
  action: Action,
  entity: Entity,
): boolean => {
  console.log(`enforcing ${action} on ${entity} with token ${token}`);
  // Placeholder function for access control enforcement
  return true;
};
