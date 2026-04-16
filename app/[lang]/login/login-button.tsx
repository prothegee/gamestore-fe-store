'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/Button';

export function LoginButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="primary" className="mt-4 py-3" disabled={pending}>
      {pending ? 'Signing In...' : label}
    </Button>
  );
}
