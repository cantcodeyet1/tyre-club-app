import { Camera, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { resizeImageFile } from '../../../shared/utils/image';

export function VehiclePhotoPicker({
  label = 'Add a photo of your vehicle',
  onChange,
  value,
}: {
  label?: string;
  onChange: (dataUrl: string | undefined) => void;
  value?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const dataUrl = await resizeImageFile(file);

      onChange(dataUrl);
    } catch {
      setError('Could not use that photo. Try another one.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative h-[88px] w-full overflow-hidden rounded-[10px] bg-[#DEDEDE]">
          <img
            alt="Vehicle"
            className="size-full object-cover"
            src={value}
          />
          <button
            aria-label="Change photo"
            className="absolute inset-0 grid place-items-center bg-black/0 text-transparent transition-colors active:bg-black/30 active:text-surface"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            <span className="rounded-full bg-black/60 px-3 py-1 text-[12px] font-medium">
              Tap to change
            </span>
          </button>
          <button
            aria-label="Remove photo"
            className="absolute right-2 top-2 grid size-[24px] place-items-center rounded-full bg-black/60 text-surface transition-transform active:scale-90"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange(undefined);
            }}
          >
            <X size={14} strokeWidth={2.6} />
          </button>
        </div>
      ) : (
        <button
          className="grid h-[88px] w-full place-items-center rounded-[10px] bg-[#DEDEDE] text-center transition-colors active:bg-[#D0D0D0] disabled:opacity-60"
          disabled={isProcessing}
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          <span>
            <Camera
              aria-hidden
              className="mx-auto mb-1"
              size={24}
              strokeWidth={2.6}
            />
            <span className="block text-[14px] font-medium leading-none">
              {isProcessing ? 'Processing...' : label}
            </span>
            <span className="mt-1 block text-[12px] font-medium leading-none">
              Optional - tap to upload
            </span>
          </span>
        </button>
      )}

      {error ? (
        <p className="mt-1.5 text-[11px] font-medium text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
