import "../../index.css";
import "./page.css";
import { HomePageBg, HomePageText } from "../../components/HomePageBg";
import { motion } from "motion/react";
import { useLocation } from "preact-iso";

function Home() {
  const router = useLocation();

  return (
    <div className="bg-stone-700">
      <div className="relative m-auto w-screen max-w-[calc(5/3*100vh)] h-dscreen overflow-hidden *:pointer-events-none" onClick={() => router.route("/game")}>
        <HomePageBg />
        <HomePageText />
        <motion.div className={"start-banner"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, type: "tween", delay: 0.8 }}>
          <p>Click anywhere to start</p>
        </motion.div>
      </div>
    </div>
  );
}
export default Home;
