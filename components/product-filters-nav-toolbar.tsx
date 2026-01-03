import { Button } from '@/components/ui/button';
import { MdLocationPin } from 'react-icons/md';
import { Separator } from '@/components/ui/separator';
import { COMMON_CATEGORIES } from '@/lib/categories';
import Link from 'next/link';
import useLocationInput from '@/hooks/useLocationInput';

type ProductFilterNavToolbarProps = {
  baseUrl?: string;
};

export default function ProductFilterNavToolbar({baseUrl = '/search'}: ProductFilterNavToolbarProps) {
  const location = useLocationInput();

  return <div className="flex-1 flex flex-row items-center gap-4 px-5 overflow-x-auto h-full">
        <div>
          <Button size="xs" rounded variant="secondary"><MdLocationPin /> {location?.fullAddress.split(",")[0]}</Button>
        </div>

        <div className="h-full py-2">
          <Separator orientation="vertical" />
        </div>

        <div className="flex flex-row items-center gap-2">
          {COMMON_CATEGORIES.map(({ id, name }) => (
            <Link
              href={`${baseUrl}?categoryId=${id}&category=${encodeURIComponent(
                name
              )}`}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full flex flex-row items-center justify-center text-xs"
              key={`common-category-${id}`}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>;
}
