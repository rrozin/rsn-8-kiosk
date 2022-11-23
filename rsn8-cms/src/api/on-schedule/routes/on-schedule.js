'use strict';

/**
 * on-schedule router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::on-schedule.on-schedule');
