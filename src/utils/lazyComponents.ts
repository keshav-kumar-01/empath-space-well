import { lazy } from 'react';

// Lazy load heavy components to improve initial load time
export const LazyAdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const LazyBlog = lazy(() => import('@/pages/Blog'));
export const LazyCommunity = lazy(() => import('@/pages/Community'));
export const LazyResourceLibrary = lazy(() => import('@/pages/ResourceLibrary'));
export const LazyPsychTests = lazy(() => import('@/pages/PsychTests'));
export const LazyPsychTestRunner = lazy(() => import('@/pages/PsychTestRunner'));
export const LazyVoiceTherapy = lazy(() => import('@/pages/VoiceTherapy'));
export const LazyGroupTherapy = lazy(() => import('@/pages/GroupTherapy'));
export const LazyWellnessPlans = lazy(() => import('@/pages/WellnessPlans'));
export const LazyAppointmentBooking = lazy(() => import('@/pages/AppointmentBooking'));
export const LazyTherapistDashboard = lazy(() => import('@/pages/TherapistDashboard'));

// Heavy components that should be lazy loaded
export const LazyChatInterface = lazy(() => import('@/components/ChatInterface'));
export const LazyCustomerServiceBot = lazy(() => import('@/components/CustomerServiceBot'));