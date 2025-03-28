export enum CompetitionStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
  PAUSED = 'Paused',
  CLOSED_WINNERS_PENDING = 'ClosedWinnersPending',
  CLOSED_WINNERS_SELECTED = 'ClosedWinnersSelected',
  CLOSED_WINNERS_ANNOUNCED = 'ClosedWinnersAnnounced'
}

export enum CompetitionPaymentStatus {
  PAYMENT_PENDING_FROM_SPONSOR = 'PaymentPendingFromSponsor',
  PAYMENT_RECEIVED_FROM_SPONSOR = 'PaymentReceivedFromSponsor',
  PARTIAL_PAYMENT_RECEIVED = 'PartialPaymentReceivedFromSponsor',
  PAYMENT_REMITTED_TO_WINNERS = 'PaymentRemittedToWinners'
}

export enum PrizeType {
  CASH = 'Cash',
  GIFT = 'Gift',
  VOUCHER = 'Voucher'
}

export interface Competition {
  id: number;
  title: string;
  description: string;
  status: CompetitionStatus;
  paymentStatus: CompetitionPaymentStatus;
  startDate: string;
  endDate: string;
  totalPrizeValue: number;
  banner1Url?: string;
  banner2Url?: string;
  banner3Url?: string;
  sponsor?: { id: number };
  isActive?: boolean;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
  remark?: string;
}

export interface CompetitionPayload extends Omit<Competition, 'id'> {}

export interface CompetitionPrize {
  prizeType: PrizeType;
  prizeValue: number;
  countOfPossibleWinners: number;
}

export interface CompetitionSearchParams {
  title?: string;
  status?: CompetitionStatus;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface CompetitionState {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}
