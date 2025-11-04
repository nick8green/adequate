import type { User as UserObject } from '@content/graph/generated/types';
import DataLoader from '@content/repository/DataLoader';

/**
 * TEMPORARY UNTIL USER SERVICE IS READY
 * User repository that directly maps to the UserObject type.
 */
export class User extends DataLoader<UserObject, UserObject, UserObject> {
  constructor() {
    super('user');
  }
}

const repo = new User();
export default repo;
