import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MoviesSliderProps {
  movies: Movie[];
  onTrailer: (id: number) => void;
  onPesan: (id: number) => void;
  onSeeAll?: () => void;
}

const MoviesSlider: React.FC<MoviesSliderProps> = ({
  movies,
  onTrailer,
  onPesan,
  onSeeAll,
}) => {
  return (
    <section className="container mx-auto px-4 py-10 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sedang Tayang</h2>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-2 border-2 border-cyan-600 text-cyan-600 px-4 py-1 rounded-full hover:bg-cyan-600 hover:text-white transition"
        >
          Lihat Semua <span className="text-lg">›</span>
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        loop={true}
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              onTrailer={onTrailer}
              onPesan={onPesan}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="swiper-button-prev-custom absolute top-1/2 -left-12 z-10 border-2 border-cyan-600 text-cyan-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-600 hover:text-white transition transform -translate-y-1/2 text-2xl font-bold">
        ←
      </button>
      <button className="swiper-button-next-custom absolute top-1/2 -right-12 z-10 border-2 border-cyan-600 text-cyan-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-600 hover:text-white transition transform -translate-y-1/2 text-2xl font-bold">
        →
      </button>
    </section>
  );
};

export default MoviesSlider;
