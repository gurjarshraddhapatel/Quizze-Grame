import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import LoginSignUp from './components/LoginSignUp';
import Home from './components/Home';
import Result from './components/Result';
import Playquiz from './components/Playquiz';
import Pollresult from './components/Pollresult';

export const userServer = "http://localhost:4000//api/v1/user"
export const quizServer = "http://localhost:4000//api/v1/quiz"


function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<LoginSignUp/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/result' element={<Result/>}></Route>
          <Route path='/poll' element={<Pollresult/>}></Route>
          <Route path='/playQuiz/:id' element={<Playquiz/>}></Route>
          <Route path='/Poll/:id' element={<Playquiz/>}></Route>
        </Routes>
        <Toaster />
    </Router>
  );
}

export default App;
