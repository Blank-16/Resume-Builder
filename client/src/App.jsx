import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Home, Dashboard, Layout, Login, Preview, Resumebuilder } from './pages/index'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'


function App() {

  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: token }
        })
        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }

        dispatch(setLoading(false))
      }
      else {
        dispatch(setLoading(false))
      }

    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }
  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<Resumebuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />

      </Routes>
    </>
  )
}

export default App
