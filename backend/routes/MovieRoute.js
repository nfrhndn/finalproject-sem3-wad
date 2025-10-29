import express from "express";
import {
  getPopular,
  getMovieDetail,
  getNowPlaying,
  getAllMovies,
  publishMovie,
  unpublishMovie,
  deleteMovie,
  getPublishedMovies,
  getUpcomingMovies,
  importMoviesFromTMDB,
  getTrailer,
} from "../controllers/MovieController.js";

import { verifyToken, verifyAdmin } from "../middleware/Auth.js";

const router = express.Router();
router.get("/popular", getPopular);
router.get("/now_playing", getNowPlaying);
router.get("/published", getPublishedMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/:id/trailer", getTrailer);
router.get("/:id", getMovieDetail);
router.get("/", getAllMovies);

router.get("/admin", verifyToken, verifyAdmin, getAllMovies);
router.post("/admin/import", verifyToken, verifyAdmin, importMoviesFromTMDB);
router.post("/:id/publish", verifyToken, verifyAdmin, publishMovie);
router.post("/:id/unpublish", verifyToken, verifyAdmin, unpublishMovie);
router.put("/:id/unpublish", verifyToken, verifyAdmin, unpublishMovie);
router.delete("/:id", verifyToken, verifyAdmin, deleteMovie);

export default router;
