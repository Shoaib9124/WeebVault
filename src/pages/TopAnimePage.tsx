import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface AnimeData {
  mal_id: number;
  title: string;
  synopsis: string;
  episodes: number | null;
  type: string;
  score: number;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

export default function TopAnimePage() {
  const [topAnime, setTopAnime] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=24`);
        const data = await response.json();
        
        if (page === 1) {
          setTopAnime(data.data || []);
        } else {
          setTopAnime(prev => [...prev, ...(data.data || [])]);
        }
        
        setHasMore((data.pagination?.has_next_page) ?? false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching top anime:', error);
        setIsLoading(false);
      }
    };

    fetchTopAnime();
  }, [page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Top Anime</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topAnime.map((anime, index) => (
          <div
            key={`${anime.mal_id}-${index}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${(index % 24) * 50}ms` }}
          >
            <div className="relative">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 m-2 rounded-full text-sm font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {anime.score}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {anime.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {anime.synopsis}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Episodes: {anime.episodes || 'TBA'}</span>
                <span className="text-sm font-medium text-indigo-600">{anime.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}