import PopularBooks from "../components/PopularBooks";
import PopularQuizzes from "../components/PopularQuizzes";
import { Hero } from "../components/Hero";
import Reviews from "../components/Reviews";
import RecommendedBooks from "../components/RecommendedBooks";
import { DisableRightClickAndShortcuts } from "../components/RestrictShowPdf";
import CategoryCard from "../components/ExamCard";
export default function Home() {
  return (
    <div className="mx-auto px-4 w-full">
      {/* <DisableRightClickAndShortcuts/> */}
      <Hero />
      <CategoryCard/>
      {/* <Reviews /> */}
      <PopularBooks />
      <RecommendedBooks />
      <PopularQuizzes />
    </div>
  );
}
