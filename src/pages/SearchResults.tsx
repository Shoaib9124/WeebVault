import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';

interface AnimeResult {
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

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=24`);
        const data = await response.json();
        setResults(data.data || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      }
      setIsLoading(false);
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Search Results for "{query}"
      </h1>
      
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No results found for "{query}"</p>
          <p className="text-gray-500 mt-2">Try searching with different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((anime) => (
            <div
              key={anime.mal_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full h-48 object-cover"
                />
                {anime.score && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 m-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {anime.score}
                  </div>
                )}
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
      )}
    </div>
  );
}