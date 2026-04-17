import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { getSession } from '@/lib/api/account';

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const user = await getSession();

  if (!user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="py-20">
      <Container>
        <div className="bg-steam-darkest/40 p-8 rounded border border-white/5 flex flex-col md:flex-row gap-8">
          <div className="w-32 h-32 rounded bg-steam-dark relative overflow-hidden border-2 border-steam-light/50 shrink-0">
            {user.avatarUrl && (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                fill
                sizes="128px"
                className="object-cover"
              />
            )}
          </div>

          <div className="grow">
            <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
            <p className="text-gray-400 mb-6">{user.email}</p>

            {/* TMP: hidden until further notice */}
            <div className="flex gap-4 hidden">
              <Button variant="secondary">Edit Profile</Button>
              <Button variant="outline">Inventory</Button>
            </div>
          </div>

          <div className="bg-black/20 p-6 rounded w-full md:w-64">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Account Status</h3>
            <div className="text-steam-light font-bold text-xl mb-1">Level 10</div>
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-steam-light w-2/3" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
