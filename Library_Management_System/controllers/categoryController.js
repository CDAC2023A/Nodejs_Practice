const Category = require('../models/categoryModel');

module.exports = {
    create: async (req, resp) => {
        const newCategory = await Category.create({ // Use the same variable name here
            name: req.body.name
        });
        return resp.send(newCategory);
    }
}
