import { redirect } from 'next/navigation';

export default function TestDrive({ params }: { params: { id: string } }) {
  redirect('/testdrives');
}
