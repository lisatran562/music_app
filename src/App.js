
import {Routes, Route} from 'react-router-dom'
import Index from './views/Index.jsx'
import Dashboard from './views/Dashboard.jsx'
import Recommendations from './components/Recommendations'


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </div>
  )
}

export default App;