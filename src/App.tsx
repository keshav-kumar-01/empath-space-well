import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import UserProfile from '@/pages/UserProfile';
import Journal from '@/pages/Journal';
import Community from '@/pages/Community';
import CreatePost from '@/pages/CreatePost';
import PostDetail from '@/pages/PostDetail';
import Blog from '@/pages/Blog';
import CreateBlogPost from '@/pages/CreateBlogPost';
import EditBlogPost from '@/pages/EditBlogPost';
import BlogPost from '@/pages/BlogPost';
import PersonalityQuiz from '@/pages/PersonalityQuiz';
import PsychTests from '@/pages/PsychTests';
import PsychTestRunner from '@/pages/PsychTestRunner';
import TestResults from '@/pages/TestResults';
import Feedback from '@/pages/Feedback';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/context/AuthContext';
import Settings from "@/pages/Settings";
import Dashboard from "@/pages/Dashboard";
import MoodTracker from "@/pages/MoodTracker";
import CrisisSupport from "@/pages/CrisisSupport";
import ResourceLibrary from "@/pages/ResourceLibrary";
import AppointmentBooking from "@/pages/AppointmentBooking";
import Navigation from "@/components/Navigation";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              <Route path="/crisis-support" element={<CrisisSupport />} />
              <Route path="/resources" element={<ResourceLibrary />} />
              <Route path="/appointments" element={<AppointmentBooking />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/create" element={<CreatePost />} />
              <Route path="/community/post/:id" element={<PostDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/create" element={<CreateBlogPost />} />
              <Route path="/blog/edit/:id" element={<EditBlogPost />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/quiz" element={<PersonalityQuiz />} />
              <Route path="/psych-tests" element={<PsychTests />} />
              <Route path="/psych-tests/:testType" element={<PsychTestRunner />} />
              <Route path="/test-results/:resultId" element={<TestResults />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
