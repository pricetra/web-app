import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PromotionsPageClient from './promotions-page-client';
import { cachedStore } from '../page';
import LayoutProvider from '@/providers/layout-provider';

type Props = {
  params: Promise<{ store: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store } = await params;
  const storeData = await cachedStore(store);
  if (!storeData) return {};

  const title = `Promotions at ${storeData.name} - Pricetra`;
  const description = `Find promotions at ${storeData.name}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pricetra.com/stores/${storeData.slug}/promotions`,
    },
  };
}

export default async function PromotionsPage({ params }: Props) {
  const { store: storeSlug } = await params;
  if (!storeSlug) {
    notFound();
  }
  const storeData = await cachedStore(storeSlug);
  if (!storeData) notFound();

  return (
    <LayoutProvider>
      <PromotionsPageClient storeSlug={storeSlug} store={storeData} />
    </LayoutProvider>
  );
}
