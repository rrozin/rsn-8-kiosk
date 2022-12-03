'use strict';

/**
 * off-schedule controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::off-schedule.off-schedule');
