import { create } from 'zustand';
import { ClaimResourceType } from '@/features/moderation/model/types';

interface ClaimReportState {
  isModalOpen: boolean;
  resourceId: string | null;
  resourceType: ClaimResourceType | null;
  openModal: (resourceId: string, resourceType: ClaimResourceType) => void;
  closeModal: () => void;
}

export const useClaimReportStore = create<ClaimReportState>(set => ({
  isModalOpen: false,
  resourceId: null,
  resourceType: null,
  openModal: (resourceId: string, resourceType: ClaimResourceType) =>
    set({ isModalOpen: true, resourceId, resourceType }),
  closeModal: () => set({ isModalOpen: false, resourceId: null, resourceType: null }),
}));
