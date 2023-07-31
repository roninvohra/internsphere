import logo from './logo.svg';
import './App.css';
import ListGroup from './components/listgroup';
import NavBar from './components/NavBar'
import ReactDOM from "react-dom/client";
import SignUp from './components/Register';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Layout from './components/Layout';
import SignOut from './components/SignOut';
import Thread from './components/Thread';
import Feedback from './components/Feedback';

function App() {
  return (
    <>
      
      <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={< SignUp />} />
        <Route path="/login" element={< Login />} />
        <Route path="/signout" element={< SignOut />} />
        <Route path="/thread" element={< Thread />} />
        <Route path="/feedback" element={< Feedback />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render (<App/>)
export default App;
