import { PackageSearch } from 'lucide-react';

import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useProducts } from '../../../shared/hooks/useAppData';
import {
  DealsBackHeader,
  DealsPanel,
  DealsScreen,
} from '../components/DealsScreenChrome';

export default function ProductsPage() {
  const query = useProducts();
  const products = query.data ?? [];

  return (
    <DealsScreen className="pb-8">
      <DealsBackHeader title="Products & services" />

      <section className="mb-5 rounded-[14px] bg-[#1D1D1D] p-4 text-surface">
        <div className="flex items-center gap-4">
          <span className="grid size-[48px] place-items-center rounded-[10px] bg-[#E8EEFF] text-[#4567D5]">
            <PackageSearch size={30} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[18px] font-bold leading-none">
              Tyres & services
            </h1>
            <p className="mt-2 text-[12px] font-medium leading-none text-[#BDBDBD]">
              Browse common fitments and support
            </p>
          </div>
        </div>
      </section>

      {query.isLoading ? <LoadingState label="Loading products" /> : null}
      <div className="grid gap-4">
        {products.map((product) => (
          <DealsPanel key={product.id}>
            <p className="text-[12px] font-bold uppercase leading-none text-[#777777]">
              {product.category}
            </p>
            <h2 className="mt-3 text-[18px] font-bold leading-none">
              {product.name}
            </h2>
            <p className="mt-3 text-[13px] font-medium leading-6 text-[#666666]">
              {product.description}
            </p>
          </DealsPanel>
        ))}
      </div>
    </DealsScreen>
  );
}
