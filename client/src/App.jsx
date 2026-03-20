import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import StatesListPage from './pages/states/StatesListPage'
import StateDetailPage from './pages/states/StateDetailPage'
import QuestionsListPage from './pages/community/QuestionsListPage'
import QuestionDetailPage from './pages/community/QuestionDetailPage'
import AskQuestionPage from './pages/community/AskQuestionPage'
import DiscussionsPage from './pages/community/DiscussionsPage'
import NewsPage from './pages/news/NewsPage'
import NewsDetailPage from './pages/news/NewsDetailPage'
import PublicationsPage from './pages/publications/PublicationsPage'
import BlogListPage from './pages/blog/BlogListPage'
import BlogDetailPage from './pages/blog/BlogDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AboutRTEPage from './pages/know-your-rte/AboutRTEPage'
import RightsPage from './pages/know-your-rte/RightsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* States */}
            <Route path="/states" element={<StatesListPage />} />
            <Route path="/states/:stateSlug" element={<StateDetailPage />} />

            {/* Community */}
            <Route path="/community/questions" element={<QuestionsListPage />} />
            <Route path="/community/questions/:id" element={<QuestionDetailPage />} />
            <Route path="/community/ask" element={<AskQuestionPage />} />
            <Route path="/community/discussions" element={<DiscussionsPage />} />

            {/* News */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />

            <Route path="/publications" element={<PublicationsPage />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            {/* Know Your RTE */}
            <Route path="/know-your-rte/about" element={<AboutRTEPage />} />
            <Route path="/know-your-rte/rights" element={<RightsPage />} />

            {/* Search */}
            <Route path="/search" element={<SearchResultsPage />} />

            {/* Admin */}
            <Route path="/admin/*" element={
              <ProtectedRoute roles={['admin', 'moderator']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}
