import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HeroOrange from './variants/HeroOrange';
import HeroBlue from './variants/HeroBlue';
import HeroPurple from './variants/HeroPurple';
import HeroGreen from './variants/HeroGreen';
import HeroRed from './variants/HeroRed';
import HeroTeal from './variants/HeroTeal';
import HeroGrayscale from './variants/HeroGrayscale';
import HeroBlackWhite from './variants/HeroBlackWhite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/orange" replace />} />
        <Route path="/orange" element={<HeroOrange />} />
        <Route path="/blue" element={<HeroBlue />} />
        <Route path="/purple" element={<HeroPurple />} />
        <Route path="/green" element={<HeroGreen />} />
        <Route path="/red" element={<HeroRed />} />
        <Route path="/teal" element={<HeroTeal />} />
        <Route path="/grayscale" element={<HeroGrayscale />} />
        <Route path="/blackwhite" element={<HeroBlackWhite />} />
      </Routes>
    </Router>
  );
}

export default App;
