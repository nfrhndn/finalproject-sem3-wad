import ScheduleCard from "../components/ScheduleCard";
import MovieCard from "../components/MovieCard";

const Film = () => {
  return (
    <div>
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Sedang Tayang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScheduleCard
            title="Fast X"
            times={["13:30", "16:00", "19:30", "22:00"]}
            image="https://m.media-amazon.com/images/I/81cZ5+3nB0L._AC_SY679_.jpg"
          />
          <ScheduleCard
            title="John Wick: Chapter 4"
            times={["14:00", "17:30", "21:00"]}
            image="https://m.media-amazon.com/images/I/71V1zrbT7hL._AC_SY679_.jpg"
          />
          <ScheduleCard
            title="The Little Mermaid"
            times={["12:00", "15:30", "18:00", "20:30"]}
            image="https://m.media-amazon.com/images/I/81UO6eDYFeL._AC_SY679_.jpg"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Akan Tayang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MovieCard
            title="Deadpool 3"
            genre="Action, Comedy"
            description="Deadpool kembali dengan petualangan penuh aksi dan humor bersama Wolverine."
            duration="120 min"
            rating={0}
            showBooking={false}
            image="https://m.media-amazon.com/images/I/91+4g9pE9pL._AC_SY679_.jpg"
          />
          <MovieCard
            title="Inside Out 2"
            genre="Animation, Family"
            description="Petualangan baru di dalam pikiran Riley saat emosi baru muncul."
            duration="110 min"
            rating={0}
            showBooking={false}
            image="https://m.media-amazon.com/images/I/81kEQp4hJvL._AC_SY679_.jpg"
          />
          <MovieCard
            title="The Batman Part II"
            genre="Action, Thriller"
            description="Batman kembali menghadapi musuh yang lebih berbahaya di Gotham City."
            duration="150 min"
            rating={0}
            showBooking={false}
            image="https://m.media-amazon.com/images/I/81zLwAw0+4L._AC_SY679_.jpg"
          />
        </div>
      </section>
    </div>
  );
};

export default Film;
