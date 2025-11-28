import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ChallengesPage from './pages/ChallengesPage';
import FavoritesPage from './pages/FavoritesPage';
import TaskHistoryPage from './pages/TaskHistoryPage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/history" element={<TaskHistoryPage />} />
          <Route path="/challenge/:id" element={<ChallengeDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;