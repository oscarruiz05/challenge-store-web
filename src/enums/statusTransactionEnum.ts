export const StatusTransactionEnum = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  VOIDED: "VOIDED",
  ERROR: "ERROR",
} as const;

export type StatusTransactionEnum =
  (typeof StatusTransactionEnum)[keyof typeof StatusTransactionEnum];
