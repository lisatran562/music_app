import {Routes, Route} from 'react-router-dom'
import './App.css';
import Index from './views/Index';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<Index/>}/>
      </Routes>
    </div>
  );
}

export default App;
