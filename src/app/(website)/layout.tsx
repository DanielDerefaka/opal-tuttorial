import React from 'react'
import LandingPageNavbar from './_components/LandingPageNavbar'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className='flex flex-col py-10 px-10 xl:px-0 container'>
        <LandingPageNavbar/>
      {children}
    </div>
  )
}

export default layout
