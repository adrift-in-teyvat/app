import "./Modal.css";

import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "preact/compat";
import { YSDivider } from "./Divider";
import { YSButton } from "./Button";

export const YSModal = ({
  open,
  title,
  text,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  text: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) => {
  const container = document.body;
  return (
    <>
      <AnimatePresence>
        {open &&
          createPortal(
            <motion.div
              className={"ys-modal-container"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", easing: "easeOut", duration: 0.1 }}
            >
              <motion.div
                className={"ys-modal"}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ type: "tween", easing: "easeOut", duration: 0.1 }}
              >
                <div
                  className={"ys-modal-bg"}
                  style={{
                    "border-image-source": "#ys-modal-border",
                  }}
                >
                  <div className={"ys-modal-corner"} />
                  <div className={"ys-modal-corner"} />
                  <div className={"ys-modal-corner"} />
                  <div className={"ys-modal-corner"} />
                </div>
                <div className={"ys-modal-content"}>
                  <p className={"text-2xl"}>{title}</p>
                  <YSDivider />
                  <div className={"grow flex items-center justify-center"}>
                    <p>{text}</p>
                  </div>
                  <YSDivider />
                  <div className={"ys-modal-button-container"}>
                    <YSButton type={"cancel"} onClick={onCancel} />
                    <YSButton type={"confirm"} onClick={onConfirm} />
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            container
          )}
      </AnimatePresence>
    </>
  );
};
