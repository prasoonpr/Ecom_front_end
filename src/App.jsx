import userRoutes from './routes/userRoutes'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import adminRoutes from './routes/adminRoutes'
import { Toaster } from 'sonner';
// import { ScrollToTop } from './components/ScrollToTop';

const routes=[...userRoutes,...adminRoutes]
const router=createBrowserRouter(routes)
function App() {


  return (
    <>
    <Toaster position="top-right" closeButton richColors />
    {/* <ScrollToTop/> */}
      <RouterProvider router={router}/>
    </>
  )
}

export default App
