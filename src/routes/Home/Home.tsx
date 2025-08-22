import "../../index.css";
import { HomePageBg, HomePageText } from "../../Components/HomePageBg";

function Home() {
  return (
    <div className="bg-stone-700">
      <div className="relative m-auto w-screen max-w-[calc(5/3*100vh)] h-dscreen overflow-hidden *:pointer-events-none">
        <HomePageBg />
        <HomePageText />
      </div>
    </div>
  );
}
export default Home;
