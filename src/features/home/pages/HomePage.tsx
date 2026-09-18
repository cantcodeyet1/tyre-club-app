import { CarFront, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import emptyElectricCar from '../../../assets/figma/home-empty-electric-car.png';
import emptyRacing from '../../../assets/figma/home-empty-racing.png';
import { Screen } from '../../../shared/components/layout/Screen';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useVehicles } from '../../../shared/hooks/useAppData';
import { useAuth } from '../../auth/authStore';

import type { Vehicle } from '../../../shared/types/domain';

function DealBanner() {
  return (
    <Link
      className="relative block h-[88px] overflow-hidden rounded-[16px] bg-[#464646] px-5 py-3 text-center text-surface shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
      to="/deals"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_100%,rgba(0,0,0,0.75)_0,transparent_36%),linear-gradient(120deg,rgba(255,255,255,0.10),rgba(0,0,0,0.55))]" />
      <div className="absolute inset-x-0 bottom-0 h-[44px] bg-[repeating-linear-gradient(90deg,#1A1A1A_0,#1A1A1A_10px,#333_10px,#333_18px)] opacity-70" />
      <div className="relative z-10">
        <p className="text-[20px] font-black leading-none">
          Rolling <span className="text-primary">Deals</span>
        </p>
        <p className="mt-2 text-[13px] font-medium leading-none text-textPrimary">
          Get{' '}
          <span className="rounded-full bg-yellow-cta px-1 font-black">
            20%
          </span>{' '}
          off your first tyre fitment!
        </p>
        <div className="mx-auto mt-7 flex w-[68px] justify-between">
          <span className="h-1 w-4 rounded-full bg-surface" />
          <span className="h-1 w-4 rounded-full bg-surface" />
          <span className="h-1 w-4 rounded-full bg-surface/70" />
          <span className="h-1 w-4 rounded-full bg-surface/70" />
        </div>
      </div>
    </Link>
  );
}

function VehiclePhoto({ good }: { good?: boolean }) {
  return (
    <span
      className={`relative grid size-[82px] shrink-0 place-items-center overflow-hidden rounded-full border-[3px] ${
        good ? 'border-[#6FE83E]' : 'border-[#F04E4E]'
      } bg-[#E6E6E6]`}
    >
      <span
        className={`absolute inset-0 ${
          good
            ? 'bg-[linear-gradient(145deg,#BFD8FF_0%,#1F4FB8_55%,#0D2159_100%)]'
            : 'bg-[linear-gradient(145deg,#D9D9D9_0%,#D43B35_50%,#1E1E1E_100%)]'
        }`}
      />
      <CarFront
        aria-hidden
        className="relative z-10 text-surface drop-shadow"
        size={46}
        strokeWidth={2.4}
      />
    </span>
  );
}

function HomeVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const isGood = vehicle.status === 'good';

  return (
    <Link
      className="block rounded-[17px] bg-surface px-4 py-3 shadow-[0_8px_22px_rgba(0,0,0,0.10)]"
      to={`/vehicles/${vehicle.id}`}
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[19px] font-bold leading-tight text-textPrimary">
            {vehicle.name}
          </h3>
          <p className="text-[14px] font-medium leading-none text-[#6F6F6F]">
            {vehicle.registration}
          </p>

          <p className="mt-5 max-w-[135px] text-[13px] font-bold leading-[1.05] text-textPrimary">
            Next:{' '}
            {isGood ? (
              <span className="font-medium">Wheel rotation in 8 weeks</span>
            ) : (
              <>
                <span className="font-medium">Insurance </span>
                <span className="text-danger-text">expired</span>
              </>
            )}
          </p>
        </div>

        <VehiclePhoto good={isGood} />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <span
          className={`inline-flex h-[22px] items-center gap-2 rounded-full border px-2.5 text-[12px] font-bold leading-none ${
            isGood
              ? 'border-[#65D845] bg-[#B9F7A2] text-[#1A1A1A]'
              : 'border-[#F04E4E] bg-[#FFDADA] text-[#1A1A1A]'
          }`}
        >
          <span
            className={`size-[10px] rounded-full ${
              isGood ? 'bg-[#6FE83E]' : 'bg-[#F04E4E]'
            }`}
          />
          {isGood ? 'All Good' : 'Attention Required'}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium leading-none text-[#8D8D8D]">
          {isGood ? 'Updated 1 day ago' : 'Updated yesterday'}
          <ChevronRight aria-hidden size={17} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const vehiclesQuery = useVehicles();
  const homeVehicles = vehiclesQuery.data ?? [];
  const firstName = user?.name.split(' ')[0] ?? 'Tendai';

  if (vehiclesQuery.isLoading) {
    return (
      <Screen className="relative min-h-[731px] bg-surface px-0 pb-[103px] pt-0">
        <LoadingState label="Loading your vehicles" />
      </Screen>
    );
  }

  return (
    <Screen
      className={
        homeVehicles.length > 0
          ? 'bg-surface px-[24px] pb-[126px] pt-[8px]'
          : 'relative min-h-[731px] bg-surface px-0 pb-[103px] pt-0'
      }
    >
      {homeVehicles.length > 0 ? (
        <section>
          <div className="mb-5">
            <p className="text-[14px] font-bold uppercase tracking-normal text-textSecondary">
              Good morning
            </p>
            <h1 className="mt-0.5 text-[22px] font-black leading-none text-textPrimary">
              {firstName}
            </h1>
          </div>

          <DealBanner />

          <div className="mb-4 mt-6 flex items-center justify-between">
            <h2 className="text-[18px] font-black leading-none text-textPrimary">
              Your vehicles
            </h2>
            <Link
              aria-label="Add vehicle"
              className="grid size-[34px] place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow"
              to="/vehicles/add"
            >
              <Plus size={23} strokeWidth={2.8} />
            </Link>
          </div>

          <div className="grid gap-5">
            {homeVehicles.map((vehicle) => (
              <HomeVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      ) : (
        <>
          <section>
            <p className="absolute left-[24px] top-[8px] text-[15px] font-bold uppercase leading-[20px] tracking-[0.02em] text-[#515151]">
              Good morning
            </p>
            <h1 className="absolute left-[24px] top-[31px] text-[25px] font-bold leading-[20px] tracking-[0.02em] text-black">
              {firstName}
            </h1>
          </section>

          <section aria-labelledby="home-empty-title">
            <img
              alt=""
              aria-hidden="true"
              className="absolute left-[135px] top-[132px] size-[125px] opacity-[0.01]"
              src={emptyRacing}
            />
            <img
              alt=""
              aria-hidden="true"
              className="absolute left-[131px] top-[150px] size-[125px] opacity-70"
              src={emptyElectricCar}
            />
            <h2
              className="absolute left-[87px] top-[299px] text-[23px] font-medium leading-[28px] tracking-[0.02em] text-black"
              id="home-empty-title"
            >
              No vehicles added
            </h2>
            <p className="absolute left-[29px] top-[339px] h-[51px] w-[338px] text-center font-inter text-[18px] font-normal leading-[21px] tracking-[0.02em] text-[#5B5B5B]">
              Add your first vehicle to start tracking maintenance and trips
            </p>
          </section>

          <Link
            className="absolute left-[27px] top-[465px] grid h-[42px] w-[345px] place-items-center rounded-[10px] bg-yellow-cta text-center text-[15px] font-semibold leading-none tracking-[0.02em] text-black"
            to="/vehicles/add"
          >
            + Add a Vehicle
          </Link>
        </>
      )}
    </Screen>
  );
}
