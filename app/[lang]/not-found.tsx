import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import Link from 'next/link';

/**
 * 404 Not Found page for language-prefixed routes.
 * This will be rendered inside the [lang] layout (with Navbar and Footer).
 */
export default function NotFound() {
  return (
    <div className="py-20 flex items-center justify-center min-h-[60vh]">
      <Container className="text-center">
        <div className="mb-8">
           <h1 className="text-9xl font-bold text-steam-dark/20 select-none">404</h1>
        </div>
        <h2 className="text-2xl font-medium text-white mb-4 uppercase tracking-widest">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-12">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button variant="primary" className="px-10 py-3">Return to Store</Button>
        </Link>
      </Container>
    </div>
  );
}
