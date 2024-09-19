const express = require('express');
const productController = require('../controllers/productController');


const router = express.Router();

router.get('/all', productController.getProducts);
router.post('/new', productController.addProduct);
router.put('/update', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

router.get('/categories', productController.getCategories);
router.post('/category/new', productController.addCategory);
router.put('/category/update', productController.updateCategory);
router.delete('/category/delete/:categoryId', productController.deleteCategory);

router.post('/uploadJSON', productController.importProducts);
router.post('/syncWithCeid', productController.syncWithCeid);


module.exports = router;