import { ChevronRight, Globe, Mail, MessageCircle, Phone } from 'lucide-react';

import {
  DealsBackHeader,
  DealsPanel,
  DealsScreen,
} from '../components/DealsScreenChrome';

const contactItems = [
  {
    detail: '+27 11 123 4567\nMon-Fri 08:00-17:00',
    icon: Phone,
    title: 'Call us',
    tone: 'green',
  },
  {
    detail: 'Chat with our team\nUsually replies within an hour',
    icon: MessageCircle,
    title: 'WhatsApp',
    tone: 'green',
  },
  {
    detail: 'info@tyreclub.co.zw\nWe respond within 24 hours',
    icon: Mail,
    title: 'Email us',
    tone: 'yellow',
  },
  {
    detail: 'www.tyreclub.co.zw\nFull catalogue and branch info',
    icon: Globe,
    title: 'Visit website',
    tone: 'blue',
  },
];

export default function HelpPage() {
  return (
    <DealsScreen>
      <DealsBackHeader title="Help & contact" />

      <section className="mb-5 rounded-[14px] bg-[#1D1D1D] px-5 py-5 text-center text-surface">
        <h1 className="text-[18px] font-bold leading-none">
          We're here to help
        </h1>
        <p className="mt-3 text-[12px] font-medium leading-none text-[#9A9A9A]">
          Choose how you'd like to get in touch
        </p>
      </section>

      <div className="grid gap-4">
        {contactItems.map((item) => {
          const Icon = item.icon;
          const toneClass = {
            blue: 'bg-[#E8EEFF] text-[#4567D5]',
            green: 'bg-[#EAF5DC] text-[#5E9B32]',
            yellow: 'bg-[#FFF5C3] text-[#D4AE00]',
          }[item.tone];
          const [lineOne, lineTwo] = item.detail.split('\n');

          return (
            <DealsPanel
              key={item.title}
              className="flex items-center gap-4 px-4 py-4"
            >
              <span
                className={`grid size-[42px] shrink-0 place-items-center rounded-[10px] ${toneClass}`}
              >
                <Icon size={23} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold leading-tight">
                  {item.title}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
                  {lineOne}
                </p>
                <p
                  className={`mt-1 text-[12px] font-medium leading-tight ${
                    item.title === 'Visit website'
                      ? 'text-[#4567D5]'
                      : item.title === 'WhatsApp'
                        ? 'text-[#5E9B32]'
                        : 'text-[#666666]'
                  }`}
                >
                  {lineTwo}
                </p>
              </div>
              <ChevronRight className="text-[#AAAAAA]" size={16} />
            </DealsPanel>
          );
        })}
      </div>
    </DealsScreen>
  );
}
