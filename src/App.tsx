import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const BASE_PATH = import.meta.env.BASE_URL
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/GlobalStyles'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ArticlePage } from './pages/ArticlePage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter basename={BASE_PATH}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            {/* Unlisted review path: same pages, drafts included */}
            <Route path="/stage" element={<Home />} />
            <Route path="/stage/article/:id" element={<ArticlePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
