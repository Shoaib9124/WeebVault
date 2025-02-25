import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Discover Your Next Favorite Anime
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Explore thousands of anime titles, keep track of your watchlist, and join a community of millions of fans.
        </p>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold flex items-center mx-auto hover:bg-indigo-700 transition duration-300">
          <Play className="w-5 h-5 mr-2" />
          Start Exploring
        </button>
      </div>
    </div>
  );
}