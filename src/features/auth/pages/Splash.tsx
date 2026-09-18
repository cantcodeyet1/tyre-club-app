import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SplashStep = {
  description: string;
  id: string;
  scene: 'brand' | 'driver' | 'road' | 'tyre' | 'workshop';
  title: string;
};

const steps: SplashStep[] = [
  {
    description: '',
    id: 'brand',
    scene: 'brand',
    title: '',
  },
  {
    description:
      'Schedule tyre checks, service reminders and more. Know what needs attention before it becomes a problem.',
    id: 'workshop',
    scene: 'workshop',
    title: 'Stay ahead of the workshop',
  },
  {
    description:
      'Insurance, license disks, radio licenses. We track it all and remind you before it costs you.',
    id: 'checkups',
    scene: 'driver',
    title: 'No more expired surprises',
  },
  {
    description:
      'Plan trips, log fuel and tollgate costs, and leave knowing your vehicle is ready for the journey.',
    id: 'trips',
    scene: 'road',
    title: 'Hit the road with confidence',
  },
  {
    description:
      'Access exclusive Tyre Club deals, flexible credit options and your nearest branch all in one place.',
    id: 'deals',
    scene: 'tyre',
    title: 'Save on every tyre',
  },
];

function BrandMark() {
  return (
    <div className="grid size-[96px] place-items-center rounded-full border-[3px] border-textPrimary bg-[#050505] shadow-[0_8px_18px_rgba(0,0,0,0.24)]">
      <div className="text-center">
        <p className="text-[17px] font-bold uppercase italic leading-none text-surface">
          Tyre Club
        </p>
        <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.18em] text-primary">
          Always rolling
        </p>
        <div className="mx-auto mt-1 h-[3px] w-12 rounded-full bg-[#F04E4E]" />
      </div>
    </div>
  );
}

function DunlopExpress() {
  return (
    <div className="flex items-center gap-1 text-[17px] font-black italic leading-none">
      <span className="grid size-3 place-items-center rounded-full bg-[#F04E4E] text-[7px] text-primary">
        ▶
      </span>
      <span>DUNLOP</span>
      <span className="rounded-sm bg-[#F04E4E] px-1 text-surface">EXPRESS</span>
    </div>
  );
}

function SceneBackground({ scene }: { scene: SplashStep['scene'] }) {
  if (scene === 'workshop') {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_42%,rgba(247,220,42,0.55)_0,rgba(247,220,42,0.25)_9%,transparent_18%),radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.16)_0,transparent_24%),linear-gradient(130deg,#101318_0%,#070707_45%,#1A1A1A_100%)]" />
        <div className="absolute left-[-28px] top-[88px] h-[280px] w-[210px] rotate-[-18deg] rounded-full border-[18px] border-[#1C1F24] shadow-[inset_0_0_0_8px_#050505]" />
        <div className="absolute bottom-[190px] left-[78px] h-[96px] w-[74px] rotate-[-22deg] rounded-[14px] bg-[#2B2B2B] shadow-[inset_0_0_0_5px_#555]" />
      </>
    );
  }

  if (scene === 'driver') {
    return (
      <>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#BEC8C5_0%,#8C9894_36%,#1D1E1B_72%,#0B0B0B_100%)]" />
        <div className="absolute left-[-70px] top-[120px] h-[240px] w-[210px] rounded-full border-[18px] border-white/20" />
        <div className="absolute right-[-30px] top-[150px] h-[270px] w-[130px] rounded-full bg-[#2B1D17]/80" />
        <div className="absolute bottom-[185px] right-[92px] h-[74px] w-[36px] rotate-[-18deg] rounded-[8px] bg-[#0B0B0B] shadow-[inset_0_0_0_4px_#CCD4D2]" />
      </>
    );
  }

  if (scene === 'road') {
    return (
      <>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#7C773D_0%,#3F4E28_28%,#11140E_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[190px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,223,108,0.45),transparent_62%)]" />
        <div className="absolute bottom-[126px] left-[78px] h-[360px] w-[82px] rotate-[-16deg] bg-[#1E1E1E]" />
        <div className="absolute bottom-[126px] left-[118px] h-[360px] w-[4px] rotate-[-16deg] bg-primary/80" />
        <div className="absolute bottom-[250px] left-[132px] h-[58px] w-[86px] rounded-[10px] bg-[#B7B3A7] shadow-[0_8px_18px_rgba(0,0,0,0.55)]" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(110deg,#05070A_0%,#1B2026_45%,#030303_100%)]" />
      <div className="absolute left-[30px] top-0 h-[580px] w-[106px] -rotate-12 rounded-full border-[20px] border-[#111820] shadow-[inset_0_0_0_7px_#37404A,0_0_28px_rgba(255,255,255,0.12)]" />
      <div className="absolute right-[18px] top-[40px] h-[600px] w-[116px] rotate-12 rounded-full border-[20px] border-[#0E141A] shadow-[inset_0_0_0_7px_#2B343D]" />
      <div className="bg-white/18 absolute right-[86px] top-0 h-full w-[8px]" />
    </>
  );
}

export default function Splash() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isBrand = step.scene === 'brand';
  const isLast = index === steps.length - 1;
  const buttonLabel = isLast ? 'Get Started' : 'Next';

  const currentKey = useMemo(() => step.id, [step.id]);

  useEffect(() => {
    if (!isBrand) {
      return;
    }

    const timeout = window.setTimeout(() => setIndex(1), 1400);

    return () => window.clearTimeout(timeout);
  }, [isBrand]);

  function goNext() {
    if (isLast) {
      navigate('/sign-in');
      return;
    }

    setIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface text-textPrimary">
      {isBrand ? (
        <section
          key={currentKey}
          className="flex min-h-screen flex-col items-center bg-[linear-gradient(160deg,#F9FF21_0%,#F7F735_55%,#F3D638_100%)] px-6 pb-9 pt-[33px]"
          onClick={goNext}
        >
          <DunlopExpress />
          <div className="grid flex-1 place-items-center">
            <BrandMark />
          </div>
          <p className="text-[14px] font-medium leading-none">Version 1.6.8</p>
        </section>
      ) : (
        <section
          key={currentKey}
          className="relative min-h-screen text-surface"
        >
          <SceneBackground scene={step.scene} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.30)_45%,rgba(0,0,0,0.92)_100%)]" />

          <button
            className="absolute right-[26px] top-[116px] z-20 text-[13px] font-bold text-surface"
            type="button"
            onClick={() => navigate('/sign-in')}
          >
            Skip
          </button>

          <div className="relative z-10 flex min-h-screen flex-col justify-end px-[20px] pb-[86px]">
            <div className="mb-14 text-center">
              <h1 className="text-[22px] font-bold leading-tight">
                {step.title}
              </h1>
              <p className="mx-auto mt-6 max-w-[296px] text-[13px] font-medium leading-[1.45] text-surface/80">
                {step.description}
              </p>
            </div>

            <button
              className="mx-auto h-12 w-full max-w-[290px] rounded-[8px] bg-yellow-cta text-[15px] font-bold text-textPrimary shadow-yellow"
              type="button"
              onClick={goNext}
            >
              {buttonLabel}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
