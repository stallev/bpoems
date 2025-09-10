'use client';

import { ClaimModal } from '@/features/moderation/ui/ClaimModal';
import { useClaimReportStore } from '@/shared/lib/store/claimReportStore';

export function ClaimReport() {
  const { isModalOpen, resourceId, resourceType, closeModal } = useClaimReportStore();

  if (!isModalOpen || !resourceId || !resourceType) {
    return null;
  }

  return (
    <ClaimModal
      isOpen={isModalOpen}
      onClose={closeModal}
      resourceId={resourceId}
      resourceType={resourceType}
      onSuccess={closeModal}
    />
  );
}
