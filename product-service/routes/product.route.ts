import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

// Middleware to set controller for all routes
router.use((req, res, next) => {
  res.locals.controller = productController;
  next();
});

// Product Management
router.get('/products', async (req, res, next) => {
  try {
    await res.locals.controller.listProducts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/product/:id', async (req, res, next) => {
  try {
    await res.locals.controller.getProduct(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    await res.locals.controller.createProduct(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    await res.locals.controller.updateProduct(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    await res.locals.controller.deleteProduct(req, res);
  } catch (error) {
    next(error);
  }
});


// Product Images
router.post('/products/:id/images', productController.addProductImage.bind(productController));
router.delete('/products/:id/images/:imageId', async (req, res, next) => {
  try {
    await productController.deleteProductImage(req, res);
  } catch (error) {
    next(error);
  }
});

// Reviews
router.post('/products/:id/reviews', productController.addReview.bind(productController));
router.get('/products/:id/reviews', productController.getProductReviews.bind(productController));

// Search & Filter
router.get('/products/search', productController.searchProducts.bind(productController));
router.get('/products/categories', productController.getCategories.bind(productController));

export default router;