  import React from "react";
  import { Box, Button, Card, CardContent, Typography, Grid, Chip, Container } from "@mui/material";
  import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
  export function Hero() {
    const navigate = useNavigate();
    const handleClick =()=>{
      
      navigate('/all-books');
    }
    return (
      <Box component="section" position="relative" py={6}>
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(219, 234, 254, 0.5)"
        />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left section with text and buttons */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Box sx={{ mb: 4 }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                  >
                    <Chip
                      label="New Arrival"
                      sx={{
                        bgcolor: "rgba(30, 58, 138, 0.1)",
                        color: "rgb(30, 58, 138)",
                        mb: 2,
                        "&:hover": {
                          bgcolor: "rgba(30, 58, 138, 0.2)",
                        },
                      }}
                    />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    style={{
                      fontSize: "4rem",
                      fontWeight: "bold",
                      color: "rgb(23, 37, 84)",
                      marginBottom: "1rem",
                      lineHeight: 1.1,
                    }}
                  >
                    Discover Your Next Favorite Book
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{
                      color: "rgba(30, 58, 138, 0.8)",
                      marginBottom: "1rem",
                      maxWidth: "600px",
                    }}
                  >
                    Explore thousands of books and interactive quizzes. Learn, grow, and challenge yourself with our curated collection.
                  </motion.p>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: "rgb(30, 58, 138)",
                        "&:hover": {
                          bgcolor: "rgb(30, 64, 175)",
                        },
                      }}
                      onClick={handleClick}
                    >
                      Shop Books
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: "rgba(30, 58, 138, 0.2)",
                        color: "rgb(30, 58, 138)",
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          bgcolor: "rgba(30, 58, 138, 0.1)",
                          borderColor: "rgba(30, 58, 138, 0.2)",
                        },
                      }}
                    >
                      Take a Quiz
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Right section with cards */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  >
                    <Card
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(30, 58, 138, 0.2)",
                      }}
                    >
                      <CardContent sx={{ p: 3 }} className="h-96">
                        <Box sx={{ position: "relative", paddingTop: "133%" }}>
                          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                            <img
                              src="https://imgs.search.brave.com/fXoIHkjzUSARn__bdG1v3Cgv7tiYUt0jWWAUXgQscTc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTF4bmRDSU1Iekwu/anBn"
                              alt="Featured Book"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "linear-gradient(to top, rgb(23, 37, 84), transparent)",
                                p: 2,
                                borderRadius: "0 0 8px 8px",
                              }}
                            >
                              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600 }}>
                                Best Seller
                              </Typography>
                              <Typography variant="body2" sx={{ color: "rgb(219, 234, 254)" }}>
                                Starting at $19.99
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={6}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                  >
                    <Card
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(30, 58, 138, 0.2)",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ position: "relative", paddingTop: "100%" }}>
                          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                            <img
                              src="/placeholder.svg?height=200&width=200"
                              alt="Quiz Section"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "linear-gradient(to top, rgb(23, 37, 84), transparent)",
                                p: 2,
                                borderRadius: "0 0 8px 8px",
                              }}
                            >
                              <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
                                Interactive Quizzes
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={6}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    <Card
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(30, 58, 138, 0.2)",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ position: "relative", paddingTop: "100%" }}>
                          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                            <img
                              src="https://imgs.search.brave.com/ALMLz0Qm75whFw8tBJyQud2EwqJVetjgnB7xAf-CUQc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcmVhbHNr/aW5kaWFyaWVzLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/My8wOS90aGUtNS1h/bS1jbHViLmpwZz9y/ZXNpemU9MzMxLDQ5/NyZzc2w9MQ"
                              alt="New Releases"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "linear-gradient(to top, rgb(23, 37, 84), transparent)",
                                p: 2,
                                borderRadius: "0 0 8px 8px",
                              }}
                            >
                              <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
                                New Releases
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }
