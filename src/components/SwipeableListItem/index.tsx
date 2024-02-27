import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface SwipeableListItemProps {
  onSwipe: () => void; // You might use this for handling the deletion logic.
  children: React.ReactNode;
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  onSwipe,
  children,
}) => {
  const [isSwiped, setIsSwiped] = useState(false);

  // Adjust based on the visual space occupied by the SVG icon plus some padding.
  const iconWidthPlusPadding = 50; // Adjust based on your actual SVG size and desired padding.

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setIsSwiped(true); // Item was swiped left, revealing the delete button.
    },
    onSwipedRight: () => {
      setIsSwiped(false); // Item was swiped right, hiding the delete button.
    },
    trackMouse: true, // This allows for mouse-based swiping on non-touch devices.
  });

  return (
    <div
      {...handlers}
      className="swipeable-list-item relative flex items-center overflow-hidden"
      style={{
        // Ensuring the list item stretches fully in height
        height: "100%",
      }}
    >
      <div
        className="flex items-center transition-transform duration-300 w-full"
        style={{
          transform: isSwiped
            ? `translateX(-${iconWidthPlusPadding}px)`
            : "translateX(0)",
        }}
      >
        {children}
      </div>
      {isSwiped && (
        <button
          onClick={() => {
            setIsSwiped(false);
            onSwipe();
          }}
          className="absolute right-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 flex justify-center items-center"
          style={{
            width: `${iconWidthPlusPadding}px`, // Adjust this width to your SVG's dimensions plus padding
            height: "100%", // Making sure the button stretches to fill the list item height
            transition: "transform 0.3s ease", // Smooth transition for sliding effect
            transform: isSwiped
              ? "translateX(0)"
              : `translateX(${iconWidthPlusPadding}px)`, // Slide in or out
          }}
        >
          {/* SVG icon here */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6" // Adjust the size of the icon as needed
          >
            {/* SVG path */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SwipeableListItem;
