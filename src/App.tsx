import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Layout from './components/layout'
import { ThemeProvider } from './components/context/theme-provider'
import { WeatherDashboard } from './pages/weather-dashboard'
import { CityPage } from './pages/city-page'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,// 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark">
            <Layout>
              <Routes>
                <Route path="/" element={<WeatherDashboard />}></Route>
                <Route path="/city/:cityName" element={<CityPage />}></Route>
              </Routes>
            </Layout>
          </ThemeProvider>
        </BrowserRouter>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
}

export default App
