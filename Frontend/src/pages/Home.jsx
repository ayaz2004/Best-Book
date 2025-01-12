import React from "react";
import PopularBooks from "../components/PopularBooks";
import PopularQuizzes from "../components/PopularQuizzes";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <PopularBooks />
      <PopularQuizzes />
    </div>
  );
}
