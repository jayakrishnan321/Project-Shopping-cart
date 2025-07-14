import React from 'react'
import { useSelector } from 'react-redux';

function Userdashboard() {
    const { userInfo } = useSelector((state) => state.user);
    console.log(userInfo)
  return (
    <div>
      <h1>hi</h1>
    </div>
  )
}

export default Userdashboard
