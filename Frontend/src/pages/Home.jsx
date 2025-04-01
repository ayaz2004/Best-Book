import PopularBooks from "../components/home/PopularBooks";
import PopularQuizzes from "../components/home/PopularQuizzes";
import { Hero } from "../components/Hero";
import Reviews from "../components/admin/userAnalytics/Reviews";
import RecommendedBooks from "../components/home/RecommendedBooks";
import { DisableRightClickAndShortcuts } from "../utils/RestrictShowPdf";
import CategoryCard from "../components/ExamCard";
import { NewArrivalsGrid } from "../components/home/NewArrival";
export default function Home() {
  return (
    <div className="w-full">
      {/* <DisableRightClickAndShortcuts/> */}
      <Hero />

      <NewArrivalsGrid />
      {/* <Reviews /> */}
      <PopularBooks />
      <RecommendedBooks />
      <PopularQuizzes />
    </div>
  );
}
