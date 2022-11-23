'use strict';

/**
 * on-schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::on-schedule.on-schedule');
