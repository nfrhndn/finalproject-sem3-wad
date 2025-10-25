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
} from "../controllers/MovieController.js";
import {
  verifyToken,
  verifyAdmin,
  verifyAdminToken,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/popular", getPopular);
router.get("/now_playing", getNowPlaying);
router.get("/published", getPublishedMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/:id", getMovieDetail);
router.put("/:id/publish", publishMovie);
router.put("/:id/unpublish", unpublishMovie);
router.get("/", getAllMovies);

router.get("/admin", verifyToken, verifyAdmin, getAllMovies);
router.post("/:id/publish", verifyToken, verifyAdmin, publishMovie);
router.post("/:id/unpublish", verifyToken, verifyAdmin, unpublishMovie);
router.post("/admin/import", verifyAdminToken, importMoviesFromTMDB);
router.put("/:id/unpublish", verifyToken, verifyAdmin, unpublishMovie); // 🆕
router.delete("/:id", verifyToken, verifyAdmin, deleteMovie);

export default router;
