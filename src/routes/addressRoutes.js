import express from 'express';
import {
  createAddress,
  getAddressesByUser,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.post('/', createAddress);
router.get('/user/:userId', getAddressesByUser);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
