'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { AppBar, Toolbar, Button, Card, CardActionArea, CardContent, Container, Grid, Typography, Box, IconButton, useMediaQuery, Drawer, List, ListItem, ListItemText } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}))

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        async function getFlashcards(){
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            flashycard.ai
          </Typography>
          <List>
            <ListItem Button component={Link} href="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem Button component={Link} href="/flashcards">
              <ListItemText primary="Collections" />
            </ListItem>
          </List>
        </Box>
    )

    return (
        <Container maxWidth="100vw" disableGutters>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant='h6' component="div" sx={{ flexGrow: 1 }}>
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
                            <Button color="inherit" component={Link} href="/flashcards">Collections</Button>
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
                backgroundImage: 'linear-gradient(120deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05)), linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
                py: 6,
                mb: 4,
                color: 'white',
            }}>
                <Container>
                    <Typography variant="h2" gutterBottom fontWeight="bold">Your Collections</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        component={Link}
                        href="/"
                    >
                        Back to Home
                    </Button>
                </Container>
            </Box>

            <Container>
                <Grid container spacing={3} sx={{mt:4}}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <StyledCard>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Container>
    )
}