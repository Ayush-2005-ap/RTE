import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import StatesListPage from './pages/states/StatesListPage'
import StateDetailPage from './pages/states/StateDetailPage'
import QuestionsListPage from './pages/community/QuestionsListPage'
import QuestionDetailPage from './pages/community/QuestionDetailPage'
import AskQuestionPage from './pages/community/AskQuestionPage'
import DiscussionsPage from './pages/community/DiscussionsPage'
import FileGrievancePage from './pages/grievances/FileGrievancePage'
import MyGrievancesPage from './pages/grievances/MyGrievancesPage'
import GrievanceDetailPage from './pages/grievances/GrievanceDetailPage'
import NewsPage from './pages/news/NewsPage'
import NewsDetailPage from './pages/news/NewsDetailPage'
import BlogListPage from './pages/blog/BlogListPage'
import BlogDetailPage from './pages/blog/BlogDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AboutRTEPage from './pages/know-your-rte/AboutRTEPage'
import RightsPage from './pages/know-your-rte/RightsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* States */}
          <Route path="/states" element={<StatesListPage />} />
          <Route path="/states/:stateSlug" element={<StateDetailPage />} />

          {/* Community */}
          <Route path="/community/questions" element={<QuestionsListPage />} />
          <Route path="/community/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/community/ask" element={<AskQuestionPage />} />
          <Route path="/community/discussions" element={<DiscussionsPage />} />

          {/* Grievances */}
          <Route path="/grievances/file" element={<FileGrievancePage />} />
          <Route path="/grievances/my" element={<MyGrievancesPage />} />
          <Route path="/grievances/:id" element={<GrievanceDetailPage />} />

          {/* News */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          {/* Know Your RTE */}
          <Route path="/know-your-rte/about" element={<AboutRTEPage />} />
          <Route path="/know-your-rte/rights" element={<RightsPage />} />

          {/* Search */}
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminDashboardPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
