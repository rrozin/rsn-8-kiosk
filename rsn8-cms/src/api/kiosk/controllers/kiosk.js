'use strict';

/**
 * kiosk controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::kiosk.kiosk');
