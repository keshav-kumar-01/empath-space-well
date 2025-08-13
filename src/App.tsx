import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import CommunityForum from '@/pages/CommunityForum';
import Blog from '@/pages/Blog';
import Resources from '@/pages/Resources';
import Contact from '@/pages/Contact';
import PsychologicalTests from '@/pages/PsychologicalTests';
import ArticleDetail from '@/pages/ArticleDetail';
import { QueryClient } from '@tanstack/react-query';
import AIJournaling from '@/pages/AIJournaling';
import AITherapyChat from '@/pages/AITherapyChat';
import GroupTherapy from '@/pages/GroupTherapy';
import AdminPanel from '@/pages/AdminPanel';
import AIFeatures from '@/pages/AIFeatures';
import SecurityMonitor from '@/components/SecurityMonitor';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <SecurityMonitor />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/community" element={<CommunityForum />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:articleId" element={<ArticleDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tests" element={<PsychologicalTests />} />
              <Route path="/ai-journaling" element={<AIJournaling />} />
              <Route path="/ai-therapy-chat" element={<AITherapyChat />} />
              <Route path="/group-therapy" element={<GroupTherapy />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/ai-features" element={<AIFeatures />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
