import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DemoPhishTrainer from './pages/DemoPhishTrainer.tsx'
import DemoScalpAI from './pages/DemoScalpAI.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/demo/phishtrainer', element: <DemoPhishTrainer /> },
  { path: '/demo/scalpai', element: <DemoScalpAI /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
