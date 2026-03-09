import { redirect } from 'next/navigation';

export default function CustomerPage({ params }: { params: { id: string } }) {
  redirect(`/customers`);
}
