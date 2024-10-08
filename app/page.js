'use client'
import { useState } from 'react';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Card, CardContent, CardActions, useMediaQuery, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import Head from 'next/head';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
}));

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async () => {
    // ... (keep the existing handleSubmit function)
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <SignedOut>
          <ListItem Button component="a" href="/log-in">
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem Button component="a" href="/sign-up">
            <ListItemText primary="Sign Up" />
          </ListItem>
        </SignedOut>
        <SignedIn>
          <ListItem Button component={Link} href="/flashcards">
            <ListItemText primary="Collections" />
          </ListItem>
        </SignedIn>
      </List>
    </Box>
  );

  return (
    <Container maxWidth={false} disableGutters>
      <Head>
        <title>AI Flashcards</title>
        <meta name="description" content="Create flashcards from your text using AI" />
      </Head>

      <AppBar position="fixed" color="transparent" elevation={0}>
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
              <SignedOut>
                <Button color="inherit" href="/sign-in">Login</Button>
                <Button color="inherit" href="/sign-up">Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <Button color="inherit" component={Link} href="/flashcards">Collections</Button>
                <UserButton />
              </SignedIn>
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

      <Box
        sx={{
          textAlign: 'center',
          px: 2,
          backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
          py: 20,
          color: 'white',
        }}>
        <Typography variant="h2" gutterBottom fontWeight="bold">Welcome to Flashycard!</Typography>
        <Typography variant="h5" gutterBottom>The AI way to create and study flashcards</Typography>
        <GradientButton sx={{ mt: 4, py: 1.5, px: 4, fontSize: '1.1rem' }} href="/generate">Get Started</GradientButton>
      </Box>

      <Box sx={{ my: 10, px: 2 }}>
        <Typography variant="h3" gutterBottom textAlign="center" mb={6}>
          Features
        </Typography>
        <Grid container spacing={4}>
          {[
            { title: "Easy Text Input", description: "Simply input your text and let our AI do the rest. Creating flashcards has never been easier." },
            { title: "Smart Flashcards", description: "Our AI intelligently breaks down your text into concise flashcards, perfect for efficient studying." },
            { title: "Accessible Anywhere", description: "Access your flashcards from any device, at any time. Study on the go with ease." },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 10, px: 2, py: 8, backgroundImage: 'linear-gradient(120deg, rgba(132, 250, 176, 0.1) 0%, rgba(143, 211, 244, 0.1) 100%)' }}>
        <Typography variant="h3" gutterBottom textAlign="center" mb={6}>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Basic", price: "Free", description: "Access to basic flashcards features and limited storage", action: "Choose Basic" },
            { title: "Pro", price: "$10 / month", description: "Unlimited flashcards and storage with priority support.", action: "Choose Pro", onClick: handleSubmit },
          ].map((plan, index) => (
            <Grid item xs={12} sm={6} md={5} key={index}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h4" component="div" gutterBottom>
                    {plan.title}
                  </Typography>
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    {plan.price}
                  </Typography>
                  <Typography variant="body1">
                    {plan.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto', justifyContent: 'center', pb: 2 }}>
                  <GradientButton size="large" onClick={plan.onClick}>
                    {plan.action}
                  </GradientButton>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} flashycard.ai. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}