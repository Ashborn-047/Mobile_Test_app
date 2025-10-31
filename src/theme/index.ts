export const theme = {
  colors: {
    primary: "#4CAF50",
    secondary: "#FFC107",
    background: "#F5F5F5",
    text: "#212121",
  },
  fonts: {
    main: "Arial, sans-serif",
    heading: "Georgia, serif",
  },
  spacing: (factor: number): string => `${0.25 * factor}rem`,
  breakpoints: {
    mobile: "576px",
    tablet: "768px",
    desktop: "992px",
  },
};
