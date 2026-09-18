import { AlertTriangle } from 'lucide-react';

import { Card } from './Card';

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-danger-border bg-danger-light text-danger-text">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden size={18} />
        <div>
          <p className="font-bold">Unable to load</p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    </Card>
  );
}
