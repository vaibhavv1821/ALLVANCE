import { ApplicationStatus } from '@/database/repositories/ApplicationRepository';
import { OfferAcceptanceStatus } from '@/database/repositories/OfferRepository';

export { ApplicationStatus, OfferAcceptanceStatus };

export type PlacementTabType = 'dashboard' | 'applications' | 'companies' | 'interviews' | 'offers';

export interface StatusMeta {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const APPLICATION_STATUS_METADATA: Record<ApplicationStatus, StatusMeta> = {
  WISHLIST: {
    label: 'Wishlist',
    color: '#818CF8',
    bgColor: 'rgba(129, 140, 248, 0.15)',
    description: 'Saved company / role to apply later',
  },
  APPLIED: {
    label: 'Applied',
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    description: 'Application submitted',
  },
  ASSESSMENT: {
    label: 'Assessment',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    description: 'Online test / Aptitude round in progress',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: '#0EA5E9',
    bgColor: 'rgba(14, 165, 233, 0.15)',
    description: 'Cleared OA, shortlisted for interviews',
  },
  INTERVIEW: {
    label: 'Interview',
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    description: 'Technical or HR interviews ongoing',
  },
  OFFERED: {
    label: 'Offered',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    description: 'Job offer extended',
  },
  REJECTED: {
    label: 'Rejected',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'Application unsuccessful',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    color: '#64748B',
    bgColor: 'rgba(100, 116, 139, 0.15)',
    description: 'Application withdrawn by candidate',
  },
  ON_HOLD: {
    label: 'On Hold',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    description: 'Recruitment paused or waiting on budget',
  },
};

export const OFFER_STATUS_METADATA: Record<OfferAcceptanceStatus, StatusMeta> = {
  PENDING: {
    label: 'Under Review',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    description: 'Offer letter received, awaiting candidate decision',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    description: 'Offer formally accepted',
  },
  DECLINED: {
    label: 'Declined',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'Offer declined',
  },
  EXPIRED: {
    label: 'Expired',
    color: '#64748B',
    bgColor: 'rgba(100, 116, 139, 0.15)',
    description: 'Offer decision window lapsed',
  },
};

export const DIFFICULTY_METADATA: Record<string, { label: string; color: string; bgColor: string }> = {
  EASY: { label: 'Easy', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  MEDIUM: { label: 'Medium', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  HARD: { label: 'Hard', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  VERY_HARD: { label: 'Very Hard', color: '#DC2626', bgColor: 'rgba(220, 38, 38, 0.2)' },
};
