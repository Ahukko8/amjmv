import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Intro from '@/components/Intro'
import OtherLatestFeed from '@/components/OtherLatestFeed'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-faseyha">
      <Header />
      <Intro />
      <OtherLatestFeed />
      <Footer />
    </div>
  )
}

export default page
