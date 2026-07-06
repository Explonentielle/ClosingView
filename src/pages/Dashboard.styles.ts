import { cva } from 'class-variance-authority';

export const rangeContainer = (isCustom: boolean) => ({
  borderColor: '#2a3a50',
  opacity: isCustom ? 0.4 : 1,
});

export const rangeButton = cva(
  'px-3.5 h-8 text-[11px] font-bold transition-150',
  {
    variants: {
      active: {
        true: 'bg-[#0EFF9C] text-[#0D1117]',
        false: 'bg-transparent text-[#8892a0]',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);

export const rangeButtonStyle = (isActive: boolean, isDisabled: boolean) => ({
  background: isActive ? '#0EFF9C' : 'transparent',
  color: isActive ? '#0D1117' : '#8892a0',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
});
