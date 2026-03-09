import { redirect } from 'next/navigation';

export default function InventoryPage({ params }: { params: { id: string } }) {
  redirect('/inventory');
}
