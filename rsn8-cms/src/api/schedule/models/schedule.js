const slugify = require('slugify');

console.log('testing')
module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      console.log('foo')
      if (data.name) {
        data.slug = slugify(data.name);
      }
    },
    beforeUpdate: async (params, data) => {
      console.log('bar')
      if (data.name) {
        data.slug = slugify(data.name);
      }
    },
  },
};