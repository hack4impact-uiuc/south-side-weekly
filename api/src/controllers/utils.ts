export const extractPopulateQuery = (
  query: Record<string, unknown>,
): 'none' | 'default' | 'full' => {
  if (!query.populate) {
    return 'none';
  }

  const populate = query.populate as string;

  switch (populate) {
    case 'default':
    case 'full':
      return populate;
    default:
      return 'default';
  }
};
