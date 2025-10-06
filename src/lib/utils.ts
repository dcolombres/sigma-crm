
export const getNumberOrNull = (value: FormDataEntryValue | null): number | null => {
  if (value && typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return !isNaN(num) ? num : null;
  }
  return null;
};

export const toDateOrNull = (value: FormDataEntryValue | null): Date | null => {
  const str = value as string;
  if (!str) return null;
  const [year, month, day] = str.split('-').map(Number);
  // To avoid timezone issues, use UTC
  return new Date(Date.UTC(year, month - 1, day));
};

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const toBoolean = (value: FormDataEntryValue | null): boolean => value === 'on';
