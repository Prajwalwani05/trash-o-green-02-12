import React from 'react'
import AllUsers from './AllUsers'
import AllBookings from './AllBookings'
import AllTrashmen from './AllTrashmen'
import { Box } from '@mui/material'
import AllProducts from './AllProducts'
import AllPurchasedProducts from './AllPurchasedProducts'

const Admin = () => {
  return (
    <Box mb={6}>
        <AllBookings />
        <AllTrashmen />
        <AllUsers />
        <AllPurchasedProducts />
        <AllProducts />
    </Box>
  )
}

export default Admin;