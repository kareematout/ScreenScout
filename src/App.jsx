import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import TopRated from "./pages/Top-Rated";
import MediaDetails from "./components/Media/MediaDetails/MediaDetails";

import './styles/Media.css';
import Games from "./pages/Games";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<Shows />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/games" element={<Games />} />
        <Route path="/details/:type/:id" element={<MediaDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;