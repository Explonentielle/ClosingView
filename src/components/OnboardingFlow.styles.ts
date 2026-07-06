import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const COLORS = {
  green: '#0EFF9C',
  blue: '#3b82f6',
  purple: '#9B7FE8',
  yellow: '#EFB027',
};

export const modalOverlay = {
  background: 'rgba(0,0,0,0.78)',
  zIndex: 9999,
};

export const modalCard = (visible: boolean, anim: number) => ({
  background: '#161d2e',
  border: '0.5px solid #2a3a50',
  borderRadius: 18,
  padding: 28,
  width: 350,
  maxHeight: '92vh',
  overflowY: 'auto' as const,
  transform: `scale(${0.94 + 0.06 * (visible ? 1 : 0)})`,
  animation: 'onbCardIn 250ms ease-out',
});

export const input = cva(
  'w-full h-[36px] px-3 rounded-[8px] text-[12px] text-white outline-none transition-colors',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const inputStyle = {
  background: '#1e2535',
  border: '0.5px solid #2a3a50',
};

export const button = cva(
  'w-full h-[44px] rounded-[10px] text-[13px] font-bold transition-transform active:scale-[0.98]',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const buttonStyle = (color: string) => ({
  background: color,
  color: '#0D1117',
});

export const backLinkStyle = {
  color: '#6b7a99',
};

export const dot = (isDone: boolean, isActive: boolean) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: isDone || isActive ? COLORS.green : '#2a3a50',
  boxShadow: isActive ? `0 0 0 3px rgba(14,255,156,0.3)` : 'none',
  transition: 'all 200ms',
});

export const stepContent = (anim: number) => ({
  opacity: anim,
  transform: `translateY(${(1 - anim) * 8}px)`,
  transition: 'opacity 250ms ease-out, transform 250ms ease-out',
});

export const actionButton = {
  background: '#0a0f1a',
  border: '0.5px solid #2a3a50',
};

export const actionIcon = (color: string) => ({
  width: 28,
  height: 28,
  borderRadius: 8,
  background: `${color}18`,
  border: `0.5px solid ${color}44`,
  color,
});

export const stepHeader = {
  width: 52,
  height: 52,
  borderRadius: 12,
};

export const stepHeaderIcon = (color: string) => ({
  ...stepHeader,
  background: `${color}18`,
  border: `0.5px solid ${color}44`,
});

export const fieldLabel = {
  color: '#8892a0',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 1.2,
};

export const numFieldInput = {
  background: '#1e2535',
  border: '0.5px solid #2a3a50',
};

export const successCard = {
  background: '#0a0f1a',
  border: '0.5px solid #2a3a50',
};

export const statMiniCard = {
  background: '#0a0f1a',
  border: '0.5px solid #2a3a50',
};

export const lockCard = {
  borderTop: '0.5px solid #2a3a50',
};

export const closeScoreCard = {
  background: '#060b14',
  border: '0.5px solid #0EFF9C33',
};

export const closeScoreWeights = {
  background: '#0a0f1a',
  border: '0.5px solid #2a3a50',
};

export const netBlock = (color: string) => ({
  background: '#0a0f1a',
  border: '0.5px solid #2a3a50',
  padding: 11,
});

export const netBlockIcon = (color: string) => ({
  width: 30,
  height: 30,
  borderRadius: 8,
  background: `${color}18`,
  border: `0.5px solid ${color}44`,
  fontSize: 14,
});

export const netBlockBadge = (color: string) => ({
  color,
  fontSize: 10,
  fontWeight: 700,
  background: `${color}18`,
  padding: '3px 8px',
  borderRadius: 6,
});

// Animation keyframes
export const keyframes = `
  @keyframes onbCardIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
`;
