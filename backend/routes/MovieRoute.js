import express from "express";
import {
  getPopular,
  getMovieDetail,
  getNowPlaying,
  getUpcoming,
} from "../controllers/MovieController.js";

const router = express.Router();

router.get("/popular", getPopular);
router.get("/now_playing", getNowPlaying);
router.get("/upcoming", getUpcoming);
router.get("/:id", getMovieDetail);

export default router;
