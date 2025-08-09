import Footer from '@/pages/comps/FooterPages/Footer'
import Navbar from '@/pages/comps/NavSection/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default Layout
