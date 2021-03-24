import { BASE_URL } from './apiWrapper';

const buildURI = (
  endpoint: string,
  successRedirect: string,
  failureRedirect = '/login',
): string => {
  const uri = new URL(`${BASE_URL}/${endpoint}`);

  switch (endpoint) {
    case 'auth/login':
      uri.searchParams.append('successRedirect', successRedirect);
      uri.searchParams.append('failureRedirect', failureRedirect);
      break;
    default:
      break;
  }

  return uri.href;
};

export default buildURI;
