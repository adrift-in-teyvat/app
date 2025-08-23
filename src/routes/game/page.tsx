import "../../index.css";
import { motion } from "motion/react";
import { Map } from "../../components/Map";

function Game() {
  return (
    <motion.div>
      <Map></Map>
    </motion.div>
  );
}

export default Game;
