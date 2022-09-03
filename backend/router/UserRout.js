import express from "express";
import { deletUser, followUser, getUser, unFollowUser, updatUser } from "../controller/UserCont.js";
const router = express.Router();

router.get('/:id', getUser)
router.put('/:id', updatUser)
router.delete('/:id', deletUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unFollowUser)

export default router;
