import express from "express";
import { createPost, deletPost, getPost, getTimeLinePost, likePost, updatPost } from "../controller/PostCont.js";
const router = express.Router();

router.post('/', createPost)
router.get('/:id', getPost)
router.put('/:id', updatPost)
router.delete('/:id', deletPost)
router.put('/:id/like', likePost)
router.get('/:id/timeline', getTimeLinePost)
export default router;