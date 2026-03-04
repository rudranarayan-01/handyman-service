import Blog from '@/components/Blog'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import AboutPage from './AboutPage'
// import React from 'react'

const BlogPage = () => {
  return (
    <div>
        <Header/>
        <AboutPage/>
        <Blog/>
        <Footer/>
    </div>
  )
}

export default BlogPage