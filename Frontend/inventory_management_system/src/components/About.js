import React from 'react'

export default function About() {
  return (
    <div className='container-fluid p-5'>
        <h1>About Smart Inventory</h1>
        <p>
          <strong>Smart Inventory</strong> is a modern, full-featured inventory management system built with the MERN stack (MongoDB, Express, React, Node.js). It empowers businesses to efficiently track, manage, and optimize their inventory in real time.
        </p>
        <h3>Unique Features</h3>
        <ul className="fs-5">
          <li>Live product statistics and dashboard insights</li>
          <li>Real-time low stock alerts and quick access to low stock items</li>
          <li>Advanced search and filter for fast product lookup</li>
          <li>Product reservation for future demand planning</li>
          <li>Secure user authentication and personalized product lists</li>
          <li>Modern, responsive UI for seamless experience on any device</li>
          
        </ul>
        <p>
          Whether you're a small business or a growing enterprise, Smart Inventory helps you stay in control, reduce stockouts, and make smarter business decisions.
        </p>
    </div>
  )
}
