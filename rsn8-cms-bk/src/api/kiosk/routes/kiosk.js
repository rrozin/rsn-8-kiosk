'use strict';

/**
 * kiosk router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::kiosk.kiosk');
