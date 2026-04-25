import { STS, type PropType } from '../data';

interface Props {
  type: PropType;
  sm?: boolean;
}

export default function Badge({ type, sm }: Props) {
  const s = STS[type] ?? STS.default;
  const cls = sm
    ? 'inline-flex items-center gap-1 rounded-full font-semibold text-[10px] px-2 py-0.5'
    : 'inline-flex items-center gap-1 rounded-full font-semibold text-xs px-2.5 py-1';
  return (
    <span className={cls} style={{ background: s.bg, color: s.c, fontFamily: 'var(--f-ui)' }}>
      {s.lbl}
    </span>
  );
}
