const { REACT_APP_API } = process.env;

module.exports = {
  publicRuntimeConfig: {
    pageConfig: {
      auth: true,
      footer: true,  // default values of header,footer,layout and auth configs.
      header: true,
      layout: true,
    },
    api: REACT_APP_API
  },
  serverRuntimeConfig: {},
};
