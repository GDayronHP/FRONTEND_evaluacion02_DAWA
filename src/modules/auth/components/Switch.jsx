import React from 'react'

function Switch({ loginActive, setLoginActive }) {

  const handleClick = (e) => {
    const target = e.target.innerText.toLowerCase();
    if (target === 'login') {
      setLoginActive(true);
    } else if (target === 'register') {
      setLoginActive(false);
    }
  }

  return (
    <section className='space-x-4 mb-2'>
        <button onClick={handleClick} className={`p-2 cursor-pointer ${loginActive ? 'btn__active' : 'btn__deactivate'}`}>Login</button>
        <button onClick={handleClick} className={`p-2 cursor-pointer ${!loginActive ? 'btn__active' : 'btn__deactivate'}`}>Register</button>
    </section>
  )
}

export default Switch
