import { Link } from "react-router";
import "../../index.css";
import { motion } from "motion/react";

function Home() {
  return (
    <>
      <div className="flex flex-col w-screen h-screen px-5 py-3.5">
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
          className="flex flex-1 justify-center items-center grow flex-col gap-2">
          <h1 className="text-center">Adrift In Teyvat</h1>
          <p>Coming Soon...</p>
          <Link to="/game">Test</Link>
        </motion.div>
        <motion.div className="flex justify-center items-center">
          <p>
            ©2025 <Link to="https://github.com/Shob3r">Shob3r</Link> &{" "}
            <Link to="https://github.com/ChakornK">ChakornK</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
export default Home;
