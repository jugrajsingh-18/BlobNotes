import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import PageNotFound from './pages/PageNotFound'
import Header from './components/Header'
import AuthProvider from './context/AuthContext'
import { Toaster } from 'sonner'
import Dashboard from './pages/Dashboard'
import SpecificList from './pages/SpecificList'

function App() {

  return (
    <AuthProvider>
            <Toaster position="top-center" />
   <BrowserRouter>
   <Header/>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/dashboard' element={<Dashboard/>} >
    <Route path=':ListId' element={<SpecificList/>} />
    </Route>
    <Route path='*' element={<PageNotFound/>} />
   </Routes>
   </BrowserRouter>
   </AuthProvider>
  )
}

export default App
