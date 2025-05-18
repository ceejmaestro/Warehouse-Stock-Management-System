import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Header/>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex flex-1 flex-col">
          <Navbar />
          {children}
        </main>
      </div>
      <Footer />
    </div>
    </>
  )
}
