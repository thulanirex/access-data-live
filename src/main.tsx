import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import router from '@/router'
import '@/index.css'

// Add a loading component
const Loading = () => <div>Loading...</div>

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
        <Toaster />
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>
)
