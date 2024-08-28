'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography, AppBar, Toolbar, Button } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import { useSearchParams } from "next/navigation"
import Link from 'next/link'

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const FlipBox = styled(Box)(({ theme, flipped }) => ({
  perspective: "1000px",
  '& > div': {
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    position: 'relative',
    width: '100%',
    height: "200px",
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transform: flipped ? 'rotateY(180deg)' : "rotateY(0deg)"
  },
  '& > div > div': {
    position: 'absolute',
    width: '100%',
    height: "100%",
    backfaceVisibility: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    boxSizing: "border-box"
  },
  '& > div > div:nth-of-type(2)': {
    transform: "rotateY(180deg)"
  },
}));

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const theme = useTheme()

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard(){
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashCards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return null
    }

    return (
        <Box sx={{
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <Typography variant='h6' component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        flashycard.ai
                    </Typography>
                    <Button color="inherit" component={Link} href="/flashcards">Back to Collections</Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: 'white' }}>
                    Your Flashcards
                </Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <StyledCard>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                        <FlipBox flipped={flipped[index]}>
                                            <div>
                                                <div>
                                                    <Typography variant="h6" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h6" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </FlipBox>
                                    </CardContent>
                                </CardActionArea>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} flashycard.ai. All rights reserved.
                </Typography>
            </Box>
        </Box>
    )
}