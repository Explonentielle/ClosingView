/**
 * Responsive utilities for consistent sizing and spacing
 */

export const responsiveClass = {
  // Main container - centered desktop, full-width mobile
  mainContainer: "w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8",

  // Tight container (Profile, Settings)
  tightContainer: "w-full max-w-[640px] mx-auto px-4 sm:px-6",

  // Medium container (Ecosystem)
  mediumContainer: "w-full max-w-[1100px] mx-auto px-4 sm:px-6",

  // Grid responsive
  gridCols1to2: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4",
  gridCols1to3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4",
  gridCols1to4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",

  // Header responsive
  headerPadding: "px-4 sm:px-6 lg:px-8",
  mainPadding: "p-4 sm:p-6 lg:p-8",

  // Typography responsive
  heading1: "text-2xl sm:text-3xl font-bold",
  heading2: "text-xl sm:text-2xl font-bold",
  heading3: "text-lg sm:text-xl font-bold",

  // Button sizing
  buttonSmall: "h-8 px-3 text-[10px] sm:text-[11px]",
  buttonMedium: "h-10 px-4 text-[12px] sm:text-[13px]",
  buttonLarge: "h-12 px-6 text-[13px] sm:text-[14px]",
};

export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/**
 * Layout helper for centered main content
 */
export const mainContentLayout = `
  w-full max-w-[1280px] mx-auto
  px-4 sm:px-6 lg:px-8
  py-4 sm:py-6 lg:py-8
`;

/**
 * Mobile-first spacing scale
 */
export const spacing = {
  xs: { mobile: "p-2", tablet: "sm:p-3", desktop: "lg:p-4" },
  sm: { mobile: "p-3", tablet: "sm:p-4", desktop: "lg:p-5" },
  md: { mobile: "p-4", tablet: "sm:p-6", desktop: "lg:p-8" },
  lg: { mobile: "p-6", tablet: "sm:p-8", desktop: "lg:p-12" },
};
