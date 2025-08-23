import "./Button.css";

import { YSButtonSymbolCancel, YSButtonSymbolConfirm } from "./Symbols";

type YSButtonType = "cancel" | "confirm";
export const YSButton = ({ type, text, onClick }: { type: YSButtonType; text?: string; onClick?: () => void }) => {
  return (
    <button className={"ys-button"} onClick={onClick}>
      {
        {
          cancel: <YSButtonSymbolCancel />,
          confirm: <YSButtonSymbolConfirm />,
        }[type]
      }
      <p className={"grow capitalize"}>{text || type}</p>
    </button>
  );
};
