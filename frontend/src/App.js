import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from './page/login';

import User from './page/user';
import Kamar from './page/kamar';
import TKamar from './page/tipe_kamar';
import History from './page/history';

import Beranda from './page/beranda';
import Riwayat from './page/riwayat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path='/kamar' element={<Kamar/>}/>
        <Route path='/tipe_kamar' element={<TKamar/>}/>
        <Route path='/history' element={<History/>}/>

        <Route path='/beranda' element={<Beranda/>}/>
        <Route path='/riwayat' element={<Riwayat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
