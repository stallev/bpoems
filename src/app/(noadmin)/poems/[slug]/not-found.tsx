import Link from 'next/link';
import { Button } from '@/shared/ui/shadcnComponents/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Poem Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The poem you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
