import { X } from 'lucide-react';

import { IconButton } from './IconButton';

import type { ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-textPrimary/40 p-4 sm:place-items-center">
      <section
        aria-modal="true"
        className="w-full max-w-sm rounded-[20px] bg-surface p-4 shadow-phone"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-textPrimary">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        {children}
      </section>
    </div>
  );
}
