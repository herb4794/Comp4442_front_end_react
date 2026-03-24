import React from 'react'
import Header from '../header/Header'
import Item from '../room/Item'

const Home = () => {

  const rooms = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Room ${i + 1}`
  }))

  return (
    <div>
      <div className='min-h-screen' >


        <Header />
        <div className="bg-white py-24">

          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-bold">Booking System</h2>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => <Item id={room.id} title={room.title} />)}
            </div>
          </div>
        </div>

        <footer className="x-auto mt-32 w-full max-w-container px-4 sm:px-6 lg:px-8" aria-labelledby="footer-heading">
          <div className="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-2">
            <p className="text-sm/6 text-gray-600 max-md:text-center">
              ©
              <a>Create by Lawrence Cheng</a>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
