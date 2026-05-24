export function routeParam(value: string | string[] | undefined): string {
  if (value === undefined) return '';
  return Array.isArray(value) ? value[0] : value;
}

export const validateVIN = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
