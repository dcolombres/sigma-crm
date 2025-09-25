
export const getNumberOrNull = (value: FormDataEntryValue | null): number | null => {
  if (value && typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return !isNaN(num) ? num : null;
  }
  return null;
};
