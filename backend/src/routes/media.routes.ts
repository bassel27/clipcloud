import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
const mediaController = require('../controllers/media.controller.ts');

const router = Router();

router.post('/upload', upload.single('media'), mediaController.uploadMedia);
router.post('/:id/like', mediaController.toggleLike);
router.get('/', mediaController.getAllMedia);

export default router;