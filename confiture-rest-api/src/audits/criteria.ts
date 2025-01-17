import { AuditType } from '@prisma/client';
import * as rgaa from '../rgaa.json';

interface CriteriumId {
  topic: number;
  criterium: number;
}

export const CRITERIA = rgaa.topics.flatMap((topic) =>
  topic.criteria.map((c) => ({
    topic: topic.number,
    criterium: c.criterium.number,
  })),
);

/**
 * Criteria list for "fast" audits.
 * Source: https://design.numerique.gouv.fr/outils/audit-rapide/
 */
export const FAST_CRITERIA = [
  { topic: 1, criterium: 1 },
  { topic: 3, criterium: 1 },
  { topic: 4, criterium: 1 },
  { topic: 4, criterium: 10 },
  { topic: 5, criterium: 3 },
  { topic: 5, criterium: 7 },
  { topic: 6, criterium: 1 },
  { topic: 6, criterium: 2 },
  { topic: 7, criterium: 1 },
  { topic: 7, criterium: 3 },
  { topic: 8, criterium: 3 },
  { topic: 8, criterium: 4 },
  { topic: 8, criterium: 5 },
  { topic: 9, criterium: 1 },
  { topic: 10, criterium: 3 },
  { topic: 10, criterium: 6 },
  { topic: 10, criterium: 7 },
  { topic: 11, criterium: 1 },
  { topic: 11, criterium: 2 },
  { topic: 11, criterium: 5 },
  { topic: 11, criterium: 6 },
  { topic: 11, criterium: 9 },
  { topic: 11, criterium: 10 },
  { topic: 12, criterium: 8 },
  { topic: 12, criterium: 9 },
];

/**
 * Criteria list for "complementary" audits.
 * Source:
 * - https://design.numerique.gouv.fr/outils/audit-rapide/
 * - https://design.numerique.gouv.fr/outils/audit-complementaire/
 */
export const COMPLEMENTARY_CRITERIA = [
  ...FAST_CRITERIA,
  { topic: 1, criterium: 3 },
  { topic: 1, criterium: 5 },
  { topic: 1, criterium: 6 },
  { topic: 1, criterium: 7 },
  { topic: 4, criterium: 2 },
  { topic: 4, criterium: 4 },
  { topic: 4, criterium: 8 },
  { topic: 4, criterium: 9 },
  { topic: 5, criterium: 4 },
  { topic: 5, criterium: 6 },
  { topic: 7, criterium: 2 },
  { topic: 8, criterium: 2 },
  { topic: 8, criterium: 6 },
  { topic: 8, criterium: 10 },
  { topic: 10, criterium: 2 },
  { topic: 10, criterium: 8 },
  { topic: 10, criterium: 9 },
  { topic: 10, criterium: 10 },
  { topic: 13, criterium: 1 },
  { topic: 13, criterium: 3 },
  { topic: 13, criterium: 4 },
  { topic: 13, criterium: 5 },
  { topic: 13, criterium: 6 },
  { topic: 13, criterium: 7 },
  { topic: 13, criterium: 8 },
];

export const CRITERIA_BY_AUDIT_TYPE: Record<AuditType, CriteriumId[]> = {
  [AuditType.FULL]: CRITERIA,
  [AuditType.FAST]: FAST_CRITERIA,
  [AuditType.COMPLEMENTARY]: COMPLEMENTARY_CRITERIA,
};
