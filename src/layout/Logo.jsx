const Logo = ({ size = "text-[1.8rem]", centered = false }) => {
  return (
    <h1
      className={`
        ${size} font-serif font-extrabold tracking-[0.1em] uppercase drop-shadow-sm
        ${centered ? "text-center" : ""}
      `}
      style={{ color: "#c89d26" }} // sampled from your signage
    >
      Le Monde
    </h1>
  );
};

export default Logo;
