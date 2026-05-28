import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import HackathonPage from '@/pages/Hackathon';
import RegisterPage from '@/pages/Hackathon/Register';
import ProjectDetailPage from '@/pages/Hackathon/ProjectDetail';
import MyProjectPage from '@/pages/Hackathon/MyProject';
import ChallengePage from '@/pages/Hackathon/Challenge';
import RankingPage from '@/pages/Ranking';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hackathon" element={<HackathonPage />} />
          <Route path="/hackathon/register" element={<RegisterPage />} />
          <Route path="/hackathon/project/:id" element={<ProjectDetailPage />} />
          <Route path="/hackathon/my-project" element={<MyProjectPage />} />
          <Route path="/hackathon/desafio" element={<ChallengePage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
