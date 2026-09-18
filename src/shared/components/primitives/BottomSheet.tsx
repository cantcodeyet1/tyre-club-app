import { Modal } from './Modal';

import type { ReactNode } from 'react';

type BottomSheetProps = {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

export function BottomSheet(props: BottomSheetProps) {
  return <Modal {...props} />;
}
