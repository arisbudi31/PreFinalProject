import React, { useEffect } from 'react';
import Axios from "axios"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './App.css';
import { Box } from '@chakra-ui/react';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Verification from './pages/Verification';
import Register from './pages/Register';

function App() {

  //Global State
  // const loading = useSelector((state) => state.user.loading)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("token")
    dispatch({ type: 'ON_START' })

    Axios.get(process.env.REACT_APP_API_URL + '/users', {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        dispatch({ type: 'LOGIN', payload: response.data.data })
        dispatch({ type: 'ON_END' })
      })
      .catch((error) => {
        console.log(error)
        dispatch({ type: 'ON_END' })
      })
  }, [])
  return (
    <Box w={"100vw"} h={"100vh"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/verification/:token' element={<Verification />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
