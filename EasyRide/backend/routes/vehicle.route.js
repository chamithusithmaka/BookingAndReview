import express from 'express';
import mongoose from 'mongoose';
import Vehicle from '../models/vehicle.model.js';

import { 
    createVehicle, 
    getAllVehicles, 
    getVehicleById, 
    updateVehicle,
    deleteVehicle, 
    searchVehicles 
} from '../controllers/vehicle.controller.js';

const router = express.Router();


router.post('/', createVehicle);

// http://localhost:5000/api/vehicles
router.get('/', getAllVehicles);


router.get('/search', searchVehicles);

// http://localhost:5000/api/vehicles/:id
router.get('/:id', getVehicleById);


router.put('/:id', updateVehicle);


router.delete('/:id', deleteVehicle);

export default router;
