import React, { useState, useEffect } from "react";

const Loader = () => {
  const [ballOffset, setBallOffset] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const animationDuration = 1000;
  const ballSize = 50;

  useEffect(() => {
    const animateLoader = () => {
      let offset = 0;
      let rotation = 0;

      const interval = setInterval(() => {
        offset += 2; // Change this value based on desired speed
        rotation += 5; // Change this value based on desired rotation speed

        if (offset >= 100) {
          offset = 0;
        }

        if (rotation >= 360) {
          rotation = 0;
        }

        setBallOffset(offset);
        setBallRotation(rotation);
      }, animationDuration / 50);

      setTimeout(() => {
        clearInterval(interval);
      }, animationDuration);
    };

    animateLoader();

    return () => {
      setBallOffset(0);
      setBallRotation(0);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100px",
        height: "100px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          borderRadius: "50%",
          backgroundColor: "#d893a3",
          transform: `translateY(-${ballOffset}%) rotate(${ballRotation}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          borderRadius: "50%",
          backgroundColor: "#86e49d",
          transform: `translateX(-${ballOffset}%) rotate(${ballRotation}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          borderRadius: "50%",
          backgroundColor: "#183b56",
          transform: `translate(-50%, ${ballOffset}%) rotate(${ballRotation}deg)`,
        }}
      />
    </div>
  );
};

export default Loader;
