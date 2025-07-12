import express from 'express';
import { reverseGeocode } from '../maps/Geocode.js';

const router = express.Router();

router.get('/reverse-geocode', reverseGeocode);

export default router;
