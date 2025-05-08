import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Granny Square Generator
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Choose how you want to start
      </p>
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        <Link
          to="/basic"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          🎨 Basic Generator
        </Link>
        <Link
          to="/book"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          📚 Book-Inspired
        </Link>
      </div>

      {/* Tailwind test */}
      <div className="p-10 bg-pink-500 text-white text-3xl">
        Tailwind is working 🎉
      </div>
    </div>
  );
}
