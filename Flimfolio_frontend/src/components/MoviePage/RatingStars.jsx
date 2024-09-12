import React from "react";

const RatingStars = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const remainingStar = rating - filledStars;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < filledStars) {
      stars.push(true);
    } else if (i === filledStars && remainingStar >= 0.5) {
      stars.push(true);
    } else {
      stars.push(false);
    }
  }

  return (
    <div className="flex py-1">
      {stars.map((star, index) => (
        <svg
          key={index}
          xmlns="https://www.w3.org/2000/svg"
          fill={star ? "#34D399" : "#D1D5DB"}
          viewBox="0 0 24 24"
          className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] md:h-4 md:w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2L8 8l-6 1 4.5 4.5L6 20l6-3 6 3-1.5-6.5L22 9l-6-1z"
          />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;
