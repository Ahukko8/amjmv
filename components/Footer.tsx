import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="max-w-5xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Dhivehi Blog. All Rights Reserved.</p>
          </div>
        </footer>
  )
}

export default Footer
