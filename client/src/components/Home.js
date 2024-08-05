import React from 'react'

const Home = () => {

  const logOut=()=>{
    // window.open('http://localhost:8000/auth/logout','_self')
  }
  return (
    <div >
      <h1>Hello Home</h1>
      <div>
        <button className="btn btn-success" onClick={logOut}>LogOut</button>
      </div>
    </div>
  )
}

export default Home
