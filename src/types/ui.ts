// UI and component types

export type Range = '7j' | '30j' | '3m' | '1a';

export interface BadgeProps {
  text: string;
  tone: 'green' | 'yellow' | 'red' | 'blue';
  dir: 'up' | 'down';
}

export interface ChartData {
  month: string;
  value: number;
  average?: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}
