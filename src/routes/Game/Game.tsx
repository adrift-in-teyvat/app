import "../../index.css";
import { motion } from "motion/react";
import { Map } from "../../Components/Map";

function Game() {
  return (
    <motion.div>
      <Map></Map>
    </motion.div>
  );
}

export default Game;
