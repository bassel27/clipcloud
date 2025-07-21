import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { getAllMediaHandler, toggleLikeHandler, uploadMediaHandler } from '../controllers/media.controller';


const router = Router();

router.post('/upload', upload.single('media'), uploadMediaHandler);
router.post('/:id/like', toggleLikeHandler);
router.get('/', getAllMediaHandler);

export default router;