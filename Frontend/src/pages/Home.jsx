import React from "react";
import PopularBooks from "../components/PopularBooks";
import PopularQuizzes from "../components/PopularQuizzes";
import { Hero } from "../components/Hero";
import Reviews from "../components/Reviews";
import RecommendedBooks from "../components/RecommendedBooks";
export default function Home() {
  return (
    <div className="mx-auto px-4 w-full">
      <Hero />
      {/* <Reviews /> */}
      <PopularBooks />
      <RecommendedBooks />
      <PopularQuizzes />
    </div>
  );
}
