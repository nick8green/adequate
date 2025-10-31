import { Audit } from '@content/graph/generated/types';
import repo, { AuditDomain as AuditRecord } from '@content/repository/Audit';

export const getAuditRecords = async (
  id: number | string,
  entity: 'PAGE' | 'POST' = 'PAGE',
): Promise<Audit[]> => {
  console.log(`Fetching audit records for ${entity.toLowerCase()} ID: ${id}`);
  return (await repo.getAll())
    .filter(
      (record: AuditRecord) => record.id === id && record.entity === entity,
    )
    .sort((a: Audit, b: Audit) => {
      const aDate = new Date(a.timestamp).getTime();
      const bDate = new Date(b.timestamp).getTime();
      return bDate - aDate; // Descending order
    });
};
