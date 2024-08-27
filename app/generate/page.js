'use client'

import { useUser } from "@clerk/nextjs"
import { db } from "@/firebase"
import { AppBar, Toolbar, Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography, IconButton, useMediaQuery, Drawer, List, ListItem, ListItemText } from "@mui/material"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {doc, collection, setDoc, getDoc, writeBatch} from 'firebase/firestore'
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

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const handleSubmit = async() => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
          }
        
          try {
            const response = await fetch('/api/generate', {
              method: 'POST',
              body: text,
            })
        
            if (!response.ok) {
              throw new Error('Failed to generate flashcards')
            }
        
            const data = await response.json()
            setFlashCards(data)
          } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
          }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if(collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists")
                return
            }
            else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge:true})
            }
        } else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        });

        await batch.commit()
        handleClose()
        router.push("/flashcards")
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

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return(
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
                    <Typography variant="h2" gutterBottom fontWeight="bold">Generate Flashcards</Typography>
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

            <Container maxWidth="md">
                <Box sx={{
                    mt:4, mb:6, display:"flex", flexDirection: 'column', alignItems: 'center'
                }}>
                    <Paper sx={{p:4, width:"100%"}}>
                        <TextField value={text} onChange={(e) => setText(e.target.value)} label="Enter Text" fullWidth multiline rows={4} variant="outlined" sx={{mb:2}} />
                        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                            Submit
                        </Button>
                    </Paper>
                </Box>

                {flashcards.length > 0 && (
                    <Box sx={{mt:4}}>
                        <Typography variant='h5' gutterBottom>Flashcards Preview</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index} >
                                    <StyledCard>
                                        <CardActionArea onClick={() => handleCardClick(index)}>
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: "1000px",
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: "200px",
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                        transform: flipped[index] 
                                                        ? 'rotateY(180deg)' 
                                                        : "rotateY(0deg)"
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: "100%",
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: "border-box"
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: "rotateY(180deg)"
                                                    },
                                                }}>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h6" component={"div"}>
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div style={{overflow: "auto", display:'flex', alignItems:'flex-start'}}>
                                                            <Typography variant="body1" component={"div"}>
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
                            <Button variant="contained" color="secondary" onClick={handleOpen}>
                                Save Collection
                            </Button>
                        </Box>
                    </Box>
                )}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your flashcard collection
                        </DialogContentText>
                        <TextField
                        autoFocus
                        margin="dense"
                        label='Collection Name'
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={saveFlashcards} color="primary" variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Container>
    )
}