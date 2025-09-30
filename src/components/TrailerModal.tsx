import React from "react";

interface TrailerModalProps {
  trailerKey: string | null;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ trailerKey, onClose }) => {
  if (!trailerKey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg overflow-hidden w-[90%] max-w-3xl">
        <div className="flex justify-end p-2">
          <button
            className="text-white text-xl hover:text-cyan-400 transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <iframe
          className="w-full h-[400px] md:h-[500px]"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
          title="Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
