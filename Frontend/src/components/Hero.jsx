import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Container,
} from "@mui/material";
import { ShimmerButton } from "./ShimmerButton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTypewriter } from "../utils/TypeWriter";
export function Hero() {
  const navigate = useNavigate();
  const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);
  useEffect( () => {
    const fetchRecentlyAddedBooks = async () => {
    try {
      const response = await fetch("/api/book/recentlyAddedBooks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch recently added books.");
        return;
      }

      const data = await response.json();
      console.log(data);
      setRecentlyAddedBooks(data.books);
    } catch (error) {
      console.error("Error fetching recently added books:", error);
    }
  };
  fetchRecentlyAddedBooks();
  },[]);
  const handleClick = () => {
    navigate("/all-books");
  };
  const animatedText = useTypewriter(
    [
      "Discover Your Next Favorite Book",
      "Explore Interactive Quizzes",
      "Join Learning Communities",
      "Master Your Subjects",
    ],
    100,
    50,
    2000
  );

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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontSize: "4rem",
                    fontWeight: "bold",
                    color: "rgb(23, 37, 84)",
                    marginBottom: "1rem",
                    lineHeight: 1.1,
                    minHeight: "4.4rem", // Add this to prevent layout shift
                  }}
                >
                  {animatedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    |
                  </motion.span>
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
                  Explore thousands of books and interactive quizzes. Learn,
                  grow, and challenge yourself with our curated collection.
                </motion.p>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <ShimmerButton onClick={handleClick}>
                    Shop Books
                  </ShimmerButton>
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
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                          }}
                        >
                          <img
                            src={recentlyAddedBooks[0]?.coverImage}
                            alt="Recently Added Book"
                            className="object-contain rounded-lg h-96 w-full"
                           
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background:
                                "linear-gradient(to top, rgb(23, 37, 84), transparent)",
                              p: 2,
                              borderRadius: "0 0 8px 8px",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "white", fontWeight: 600 }}
                            >
                              Best Seller
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgb(219, 234, 254)" }}
                            >
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
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                          }}
                        >
                          <img
                            src={recentlyAddedBooks[1]?.coverImage}
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
                              background:
                                "linear-gradient(to top, rgb(23, 37, 84), transparent)",
                              p: 2,
                              borderRadius: "0 0 8px 8px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "white", fontWeight: 500 }}
                            >
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
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                          }}
                        >
                          <img
                            src={recentlyAddedBooks[2]?.coverImage}
                            alt="New Releases"
                            style={{
                              objectFit:"contain",
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
                              background:
                                "linear-gradient(to top, rgb(23, 37, 84), transparent)",
                              p: 2,
                              borderRadius: "0 0 8px 8px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "white", fontWeight: 500 }}
                            >
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
