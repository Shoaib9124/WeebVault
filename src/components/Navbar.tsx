import { Search, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      small_image_url: string;
    };
  };
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`);
        const data = await response.json();
        setSearchResults(data.data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults([]);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <h1 className="text-white text-xl font-bold group-hover:text-indigo-200 transition-colors duration-300">
                WeebVault
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-64 px-4 py-1 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:shadow-lg"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <Search className="absolute left-3 top-1.5 h-4 w-4 text-gray-400" />
                </form>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden">
                    {searchResults.map((anime) => (
                      <Link
                        key={anime.mal_id}
                        to={`/anime/${anime.mal_id}`}
                        className="block p-2 hover:bg-indigo-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={anime.images.jpg.small_image_url}
                            alt={anime.title}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <span className="text-sm text-gray-800">{anime.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/top-anime" className="text-white hover:text-indigo-200 transition-colors duration-300">Top Anime</Link>
              <Link to="/seasonal" className="text-white hover:text-indigo-200 transition-colors duration-300">Seasonal</Link>
              <Link to="/genres" className="text-white hover:text-indigo-200 transition-colors duration-300">Genres</Link>
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center text-white hover:text-indigo-200 transition-colors duration-300"
                  >
                    <span className="mr-1">{user?.username}</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fadeIn">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/watchlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Watchlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/signin"
                    className="text-white hover:text-indigo-200 transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-indigo-200 focus:outline-none transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative px-3 py-2">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Search anime..."
                  className="w-full px-4 py-1 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Search className="absolute left-6 top-3.5 h-4 w-4 text-gray-400" />
              </form>
            </div>
            <Link to="/top-anime" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Top Anime</Link>
            <Link to="/seasonal" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Seasonal</Link>
            <Link to="/genres" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Genres</Link>
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-indigo-500 my-2"></div>
                <div className="px-3 py-2 text-white font-medium">
                  Signed in as {user?.username}
                </div>
                <Link to="/profile" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Your Profile</Link>
                <Link to="/watchlist" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Watchlist</Link>
                <button
                  onClick={handleLogout}
                  className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-indigo-500 my-2"></div>
                <Link to="/signin" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Sign in</Link>
                <Link to="/signup" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition-colors duration-300">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}