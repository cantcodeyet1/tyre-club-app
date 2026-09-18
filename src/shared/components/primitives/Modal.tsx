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
    <div
      className="fixed inset-0 z-50 grid animate-[fade-in_150ms_ease-out] place-items-end bg-textPrimary/40 p-4 backdrop-blur-[1px] sm:place-items-center"
      onClick={onClose}
    >
      <section
        aria-modal="true"
        className="w-full max-w-sm origin-bottom animate-[modal-in_180ms_ease-out] rounded-[20px] bg-surface p-4 shadow-phone sm:origin-center"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
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
