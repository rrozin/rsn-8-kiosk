'use strict';

/**
 * off-schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::off-schedule.off-schedule');
