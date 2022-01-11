export const config = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'South Side Weekly API',
    description: `Documentation for the South Side Weekly API. 
        This API is used to control the South Side Weekly internal contributor dashboard tool. 
        It is not intended to be used by external users. 
        If you are looking to contribute to the South Side Weekly project, 
        please contact the South Side Weekly team.`,
    contact: {
      name: 'Hack4Impact',
      email: 'uiuc@hack4impact.org',
      url: 'https://h4iuiuc.netlify.app/',
    },
  },
  basePath: ['./schema'],
};
