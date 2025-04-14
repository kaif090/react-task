import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '7o5DGYffg5EDx3WXfy1cZqN1kJT5kI8hh30Ao0xnpJp59Bu90Ed3ty2q';
const LIMIT = 20;

export default function PexelsImageApp() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('nature');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchImages = async (newSearch = false) => {
    if (loading) return;
    setLoading(true);
    const currentPage = newSearch ? 1 : page;

    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        headers: {
          Authorization: API_KEY,
        },
        params: {
          query: search,
          per_page: LIMIT,
          page: currentPage,
        },
      });

      const newImages = response.data.photos;
      setImages((prev) => (newSearch ? newImages : [...prev, ...newImages]));
      setPage((prev) => (newSearch ? 2 : prev + 1));
    } catch (error) {
      console.error('Error fetching images:', error);
    }

    setLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !loading
    ) {
      fetchImages();
    }
  };

  useEffect(() => {
    fetchImages(true);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 drop-shadow">
        🌟 kaif's Image Explorer
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search high-quality images..."
          className="p-3 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg w-72 shadow-md"
        />
        <button
          onClick={() => fetchImages(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg font-semibold shadow-md transition"
        >
          🔍 Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg transform transition hover:scale-105"
          >
            <img
              src={img.src.large}
              alt={img.alt}
              className="w-full h-52 object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <h2 className="text-sm text-gray-700 font-semibold truncate">
                {img.alt || 'Untitled Image'}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-center mt-6 text-lg font-medium text-gray-600">
          Loading more beautiful images...
        </p>
      )}
    </div>
  );
}

