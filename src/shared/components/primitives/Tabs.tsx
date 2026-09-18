import { SegmentedControl } from './SegmentedControl';

import type { SegmentOption } from './SegmentedControl';

type TabsProps<TValue extends string> = {
  label: string;
  options: SegmentOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
};

export function Tabs<TValue extends string>(props: TabsProps<TValue>) {
  return <SegmentedControl {...props} />;
}
