import { cn } from '@/lib/utils';

export type ProductMetadataBadgeType = {
  type?: 'weight' | 'quantity';
  size?: 'sm' | 'md';
  text: string;
};

export default function ProductMetadataBadge({
  text,
  type,
  size = 'md',
}: ProductMetadataBadgeType) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gray-100 px-2 py-1 leading-0',
        type === 'weight' ? 'bg-green-100' : '',
        type === 'quantity' ? 'bg-blue-100' : '',
        size === 'md' ? 'px-3 py-3' : '',
        size === 'sm' ? 'px-2 py-2' : ''
      )}>
      <span
        className={cn(
          'color-black',
          size === 'md' ? 'text-sm' : '',
          size === 'sm' ? 'text-[10px]' : ''
        )}>
        {text}
      </span>
    </div>
  );
}
