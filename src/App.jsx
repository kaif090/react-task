// PexelsImageApp.jsx
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
          Authorization: '7o5DGYffg5EDx3WXfy1cZqN1kJT5kI8hh30Ao0xnpJp59Bu90Ed3ty2q',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 font-sans px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Pexels Image Gallery
        </h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search high-quality images..."
            className="w-80 p-3 rounded-l-md border-t border-l border-b border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => fetchImages(true)}
            className="px-5 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 transition-all"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {images.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={img.src.large}
                alt={img.photographer}
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="p-2 text-sm text-gray-600 text-center bg-white">
                {img.photographer}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-600 mt-6">Loading more images...</p>
        )}
      </div>
    </div>
  );
}
