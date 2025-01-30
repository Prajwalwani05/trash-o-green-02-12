// routes/bookingRoutes.js
const express = require('express');
const { purchaseProduct, getAllPurchasedProducts, updatePurchasedProduct, deletePurchasedProduct, getPurchasedProduct } = require('../controllers/purchasedProductController');
const router = express.Router();

//router.post('/create', createBooking);
// router.get('/all', getProducts);
//router.put('/cancelBooking/:id', cancelBooking)
// Admin
// router.get('/getAllProducts', getAllProducts);
router.post('/purchaseProduct', purchaseProduct);
router.get('/getPurchasedProduct', getPurchasedProduct);
router.get('/getAllPurchasedProducts', getAllPurchasedProducts);
router.put('/updatePurchasedProduct/:id', updatePurchasedProduct);
router.delete('/deletePurchasedProduct/:id', deletePurchasedProduct);

module.exports = router;
