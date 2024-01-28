import './App.css';
import { BackendProvider } from './contexts/BackendContext';
import SignIn from './components/auth/SignIn';
import AuthDetails from './components/AuthDetails';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';


function App() {
  return (
    <BackendProvider>
    <BrowserRouter>
      <Routes>
        
        <Route index path='/' element = {<SignIn />} />
        <Route element = {<AuthDetails />} />
        <Route path='/Home' element={<Home />} />
        
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
      </BrowserRouter>
     </BackendProvider>
      
  );
}
/*

function App() {
    return (<BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
      </BrowserRouter>
      );
}
  


*/
export default App;
