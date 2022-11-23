'use strict';

/**
 * schedule-off service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::schedule-off.schedule-off');
