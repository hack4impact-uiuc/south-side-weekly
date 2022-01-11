interface Option {
  value: string;
  label: string;
}

export const optionify = (options: string[]): Option[] =>
  options.map((option) => ({ value: option, label: option }));
