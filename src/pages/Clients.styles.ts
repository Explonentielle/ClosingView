export const COLORS = {
  green: '#0EFF9C',
  blue: '#3B82F6',
  purple: '#9B7FE8',
};

export const modalOverlay = {
  background: 'rgba(13,17,23,0.75)',
  backdropFilter: 'blur(8px)',
};

export const modalCard = {
  background: '#161d2e',
  borderColor: '#2a3a50',
};

export const inputStyle = {
  background: '#0D1117',
  borderColor: '#2a3a50',
};

export const labelStyle = {
  color: '#8892a0',
};

export const typeButtonStyle = (active: boolean, color: string) => ({
  background: active ? `${color}22` : 'transparent',
  borderColor: active ? color : '#2a3a50',
  color: active ? color : '#8892a0',
});

export const typeBadgeStyle = (color: string) => ({
  background: color,
});

export const offerCardStyle = {
  background: '#0D1117',
  borderColor: '#2a3a50',
};

export const offerInputStyle = {
  background: '#161d2e',
  borderColor: '#2a3a50',
};

export const sliderStyle = {
  background: 'linear-gradient(90deg,#0EFF9C33,#0EFF9C)',
  accentColor: '#0EFF9C',
};

export const addOfferButtonStyle = {
  color: COLORS.green,
};

export const splitLabelStyle = {
  color: '#8892a0',
};

export const splitValueStyle = {
  color: COLORS.green,
};

export const submitButtonStyle = {
  background: COLORS.green,
  color: '#0D1117',
};

export const optionStyle = {
  background: '#0D1117',
};
