/**
 * Capitalizes the first letter of a string
 *
 * @param str the string to capitalize
 * @returns the capitalized string
 */
const convertToCapitalized = (str: string): string => {
  const lowercase = str.toLowerCase();

  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
};

/**
 * Converst a string to class name format
 *
 * This is a test --> this-is-a-test
 *
 * @param str the string to format
 * @returns the formatted string
 */
const convertToClassName = (str: string): string =>
  str.toLowerCase().split(' ').join('-');

/**
 * Parses a camel cased string into Title-style format
 *
 * exampleName --> Example Name
 *
 * @param str the string to parse
 * @returns the formatted string
 */
const parseCamelCase = (str: string): string => {
  const split = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  return split.charAt(0).toUpperCase() + split.slice(1);
};

export { convertToCapitalized, convertToClassName, parseCamelCase };
