'use client'

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { AppBar, Toolbar, Button, Typography, Box, IconButton, useMediaQuery, Drawer, List, ListItem, ListItemText } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton, SignIn } from "@clerk/nextjs"
import MenuIcon from '@mui/icons-material/Menu'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const LogoLockIcon = styled(LockOutlinedIcon)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  borderRadius: '50%',
  padding: theme.spacing(2),
  fontSize: '2rem',
}))

export default function SignUpPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <ListItem button component={Link} href="/">
          <ListItemText primary="Home" />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant='h6' component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            flashycard.ai
          </Typography>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/">Home</Button>
              <UserButton />
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
      }}>
        <Box sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(4),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px',
          width: '100%',
          margin: '0 auto', // Center the box horizontally
          transition: 'transform 0.3s ease-in-out', // Add smooth transition for hover effect
          '&:hover': {
            transform: 'translateY(-5px)', // Lift the box slightly on hover
          },
        }}>
          <LockOutlinedIcon />
          <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <SignIn routing="path" path="/sign-in" />
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} flashycard.ai. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}