'use strict';

/**
 * off-schedule router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::off-schedule.off-schedule');
