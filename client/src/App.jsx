import { Routes, Route } from 'react-router-dom'
import { Home, Dashboard, Layout, Login, Preview, Resumebuilder } from './pages/index'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<Resumebuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='login' element={<Login />} />

      </Routes>
    </>
  )
}

export default App
