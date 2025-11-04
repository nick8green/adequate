import type { Audit as AuditObject } from '@content/graph/generated/types';
import DataLoader from '@content/repository/DataLoader';
import { User } from '@content/repository/User';

export type AuditDomain = AuditObject & { entity: string; id: number };

type AuditRepository = {
  timestamp: string;
  user: number;
  action: string;
  entity: string;
  id: number;
};

class Audit extends DataLoader<AuditDomain, AuditRepository, object> {
  private readonly userRepo: User;

  constructor() {
    super('audit history');
    this.userRepo = new User();
  }

  protected async repositoryToDomain(
    item: AuditRepository,
  ): Promise<AuditDomain> {
    const user = await this.userRepo.get(item.user);
    return { ...item, user } as AuditDomain;
  }
}

const repo = new Audit();
export default repo;
