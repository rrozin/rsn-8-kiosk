'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('reminder-app')
      .service('myService')
      .getWelcomeMessage();
  },
});
