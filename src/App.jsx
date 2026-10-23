import { useEffect, useState } from 'react'
import Home from './screens/Home.jsx'
import Senior from './screens/Senior.jsx'
import Neighbour from './screens/Neighbour.jsx'
import Guardhouse from './screens/Guardhouse.jsx'
import Family from './screens/Family.jsx'

function currentPage() {
  return window.location.hash.replace('#/', '')
}

function App() {
  const [page, setPage] = useState(currentPage())

  useEffect(() => {
    const onHashChange = () => setPage(currentPage())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (page === 'senior') return <Senior />
  if (page === 'neighbour') return <Neighbour />
  if (page === 'guard') return <Guardhouse />
  if (page === 'family') return <Family />
  return <Home />
}

export default App
