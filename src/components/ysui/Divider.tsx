import "./Divider.css";

export const YSDivider = () => {
  return (
    <div className={"ys-divider"}>
      <svg fill={"#dad2c5"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 19 10"} height={12.5}>
        <path d="M6.5 3C5 4 0 5 0 5S5.06 6.05 6.5 7s2 2.5 2 2.5S9.07 7.93 10 7c.61-.61 1.71-1.28 2.4-1.67L15 7.5l2-1.67-.65-.43L15 6.25 13 5c-.01 0-2.08-1.08-3-2C9.07 2.07 8.5.5 8.5.5S7.43 2.38 6.5 3Z" />
        <path d="M15 2.5l2.4 2H19v1H18s-.25 0-1-.5-2-1.25-2-1.25l-1.35.85L13 4.17 15 2.5Z" />
      </svg>
      <div className={"ys-divider-line"} />
      <svg className={"ys-divider-opp"} fill={"#dad2c5"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 19 10"} height={12.5}>
        <path d="M6.5 3C5 4 0 5 0 5S5.06 6.05 6.5 7s2 2.5 2 2.5S9.07 7.93 10 7c.61-.61 1.71-1.28 2.4-1.67L15 7.5l2-1.67-.65-.43L15 6.25 13 5c-.01 0-2.08-1.08-3-2C9.07 2.07 8.5.5 8.5.5S7.43 2.38 6.5 3Z" />
        <path d="M15 2.5l2.4 2H19v1H18s-.25 0-1-.5-2-1.25-2-1.25l-1.35.85L13 4.17 15 2.5Z" />
      </svg>
    </div>
  );
};
