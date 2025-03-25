import express from 'express';
import mongoose, { get } from 'mongoose';
import User from '../models/users.model.js';
import { createUser } from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';
import { getUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);

    export default router;
