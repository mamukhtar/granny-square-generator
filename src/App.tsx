import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import BasicGenerator from './pages/BasicGenerator';
import BookInspired from './pages/BookInspired';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-900 text-white font-sans flex flex-col">

        {/* Header */}
        <header className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-5 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              🧶 Granny Square Generator
            </h1>
            <nav>
              <ul className="flex flex-wrap gap-6 text-lg font-medium">
                <li>
                  <NavLink
                    to="/basic"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                        : "hover:text-yellow-300 transition"
                    }
                  >
                    Basic Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/book"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                        : "hover:text-yellow-300 transition"
                    }
                  >
                    Book-Inspired Generator
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-6 py-10 md:px-12 max-w-7xl mx-auto w-full space-y-12">
          <Routes>
            {/* Add redirect from root path to basic generator */}
            <Route path="/" element={<Navigate replace to="/basic" />} />
            <Route path="/basic" element={<BasicGenerator />} />
            <Route path="/book" element={<BookInspired />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-zinc-800 text-gray-400 text-center py-4 text-sm">
          Site content © 2025 Maryam Aminu Mukhtar
        </footer>
      </div>
    </Router>
  );
}