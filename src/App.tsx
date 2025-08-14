
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import UserProfile from '@/pages/UserProfile';
import Community from '@/pages/Community';
import Blog from '@/pages/Blog';
import ResourceLibrary from '@/pages/ResourceLibrary';
import Feedback from '@/pages/Feedback';
import PsychTests from '@/pages/PsychTests';
import BlogPost from '@/pages/BlogPost';
import Journal from '@/pages/Journal';
import VoiceTherapy from '@/pages/VoiceTherapy';
import GroupTherapy from '@/pages/GroupTherapy';
import AdminDashboard from '@/pages/AdminDashboard';
import PsychTestRunner from '@/pages/PsychTestRunner';
import TestResults from '@/pages/TestResults';
import WellnessPlans from '@/pages/WellnessPlans';
import SecurityMonitor from '@/components/SecurityMonitor';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SecurityMonitor />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/community" element={<Community />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:articleId" element={<BlogPost />} />
              <Route path="/resources" element={<ResourceLibrary />} />
              <Route path="/contact" element={<Feedback />} />
              <Route path="/tests" element={<PsychTests />} />
              <Route path="/psych-tests/:testType" element={<PsychTestRunner />} />
              <Route path="/test-results" element={<TestResults />} />
              <Route path="/wellness-plans" element={<WellnessPlans />} />
              <Route path="/ai-journaling" element={<Journal />} />
              <Route path="/ai-therapy-chat" element={<VoiceTherapy />} />
              <Route path="/group-therapy" element={<GroupTherapy />} />
              <Route path="/admin-panel" element={<AdminDashboard />} />
              <Route path="/ai-features" element={<VoiceTherapy />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
