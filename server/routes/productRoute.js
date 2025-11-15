import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addproduct, changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addproduct);
productRouter.get('/list', productList)
productRouter.get('/:id',productById)
productRouter.post('/stock', authSeller, changeStock)

export default productRouter;