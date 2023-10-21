import React, { useState, useEffect, useRef } from "react";
import tickSound from "../../../../assets/sounds/tick.mp3";

const audio = new Audio(tickSound);

const inputArr = [
  "12 00 AM",
  "01 00 AM",
  "02 00 AM",
  "03 00 AM",
  "04 00 AM",
  "05 00 AM",
  "06 00 AM",
  "07 00 AM",
  "08 00 AM",
  "09 00 AM",
  "10 00 AM",
  "11 00 AM",
  "12 00 PM",
  "01 00 PM",
  "02 00 PM",
  "03 00 PM",
  "04 00 PM",
  "05 00 PM",
  "06 00 PM",
  "07 00 PM",
  "08 00 PM",
  "09 00 PM",
  "10 00 PM",
  "11 00 PM",
];

function TimePicker({ setState }) {
  const minIndex = 0;
  const maxIndex = inputArr.length - 1;
  const stepSize = 0.1;
  const wheelStep = 0.5;
  // parent div height === child div height === paragraph height with
  // padding === 3.75rem === 60px
  const itemHeightInPx = 60;
  const itemHeightInRem = 3.75; // make sure this value is divible by 1.5

  const [visibleValueIndex, setVisibleValueIndex] = useState(minIndex);
  const [touchStartY, setTouchStartY] = useState(null);
  const scrollableDivRef = useRef(null);

  const translateY = -1 * parseInt(visibleValueIndex) * itemHeightInPx;

  // console.log({ selectedValue: inputArr[parseInt(visibleValueIndex)] });
  // console.log({ selectedValue: parseInt(visibleValueIndex) });

  const handleTouchStart = (event) => {
    const { clientY } = event.touches[0];
    setTouchStartY(clientY);
  };

  const handleTouchMove = (event) => {
    if (touchStartY !== null) {
      const { clientY } = event.touches[0];
      const step = clientY - touchStartY > 0 ? -stepSize : stepSize;
      const temp = Math.min(
        maxIndex,
        Math.max(minIndex, visibleValueIndex + step)
      );
      if (Math.abs(parseInt(visibleValueIndex) - parseInt(temp)) === 1)
        audio.play();
      setVisibleValueIndex(temp);
      setState(parseInt(temp));
      setTouchStartY(clientY);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const step = event.deltaY < 0 ? -wheelStep : wheelStep;
    const temp = Math.min(
      maxIndex,
      Math.max(minIndex, visibleValueIndex + step)
    );
    if (Math.abs(parseInt(visibleValueIndex) - parseInt(temp)) === 1)
      audio.play();
    setVisibleValueIndex(temp);
    setState(parseInt(temp));
  };

  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;

    if (scrollableDiv) {
      scrollableDiv.addEventListener("touchstart", handleTouchStart);
      scrollableDiv.addEventListener("touchmove", handleTouchMove);
      scrollableDiv.addEventListener("wheel", handleWheel);

      return () => {
        scrollableDiv.removeEventListener("touchstart", handleTouchStart);
        scrollableDiv.removeEventListener("touchmove", handleTouchMove);
        scrollableDiv.removeEventListener("wheel", handleWheel);
      };
    }
  }, [visibleValueIndex, touchStartY]);

  return (
    <div ref={scrollableDivRef} className={`flex flex-row gap-6 items-center`}>
      <div className="flex gap-3 justify-center items-center">
        <div
          className={`w-fit px-2 h-[${itemHeightInRem}rem] rounded-[0.94rem]
          resize-none focus:outline-none outline-none overflow-y-hidden
          bg-gradient-to-b from-[#A8C3EF1A] via-[#A8C3EF] to-[#A8C3EF1A]`}
          style={{ height: `${itemHeightInRem}rem` }}
        >
          <div
            className="w-full h-full transform transition-transform duration-300
            ease-in-out"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {inputArr.map((item, index) => (
              <p
                key={index}
                className={`flex justify-center text-[#4135F3] font-light leading-normal
                text-[${itemHeightInRem / 1.5}rem]`}
              >
                {item.split(" ")[0]}
              </p>
            ))}
          </div>
        </div>
        <p className="text-[2.25rem] font-extrabold text-[#4135F3]">:</p>
        <div
          className={`w-fit px-2 h-[${itemHeightInRem}rem] rounded-[0.94rem]
          resize-none focus:outline-none outline-none overflow-y-hidden
          bg-gradient-to-b from-[#A8C3EF1A] via-[#A8C3EF] to-[#A8C3EF1A]`}
          style={{ height: `${itemHeightInRem}rem` }}
        >
          <div
            className="w-full h-full transform transition-transform duration-300
            ease-in-out"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {inputArr.map((item, index) => (
              <p
                key={index}
                className={`flex justify-center text-[#4135F3] font-light leading-normal
                text-[${itemHeightInRem / 1.5}rem]`}
              >
                {item.split(" ")[1]}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`w-fit px-2 h-[${itemHeightInRem}rem] rounded-[0.94rem]
        resize-none focus:outline-none outline-none overflow-y-hidden
        bg-gradient-to-b from-[#A8C3EF1A] via-[#A8C3EF] to-[#A8C3EF1A]`}
        style={{ height: `${itemHeightInRem}rem` }}
      >
        <div
          className="w-full h-full transform transition-transform duration-300
          ease-in-out"
          style={{ transform: `translateY(${translateY}px)` }}
        >
          {inputArr.map((item, index) => (
            <p
              key={index}
              className={`flex justify-center text-[#4135F3] font-light leading-normal
              text-[${itemHeightInRem / 1.5}rem]`}
            >
              {item.split(" ")[2]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimePicker;

// import React, { useState, useEffect, useRef } from "react";
// import tickSound from "../../../../assets/sounds/tick.mp3";

// const audio = new Audio(tickSound);

// const inputArr = [
//   "12 00 AM",
//   "01 00 AM",
//   "02 00 AM",
//   "03 00 AM",
//   "04 00 AM",
//   "05 00 AM",
//   "06 00 AM",
//   "07 00 AM",
//   "08 00 AM",
//   "09 00 AM",
//   "10 00 AM",
//   "11 00 AM",
//   "12 00 PM",
//   "01 00 PM",
//   "02 00 PM",
//   "03 00 PM",
//   "04 00 PM",
//   "05 00 PM",
//   "06 00 PM",
//   "07 00 PM",
//   "08 00 PM",
//   "09 00 PM",
//   "10 00 PM",
//   "11 00 PM",
// ];

// function TimePicker() {
//   const minIndex = 0;
//   const maxIndex = inputArr.length - 1;
//   const stepSize = 0.1;
//   const wheelStep = 0.5;
//   // parent div height === child div height === paragraph height with
//   // padding === 3.75rem === 60px
//   const itemHeightInPx = 60;
//   const itemHeightInRem = 3.75; // make sure this value is divible by 1.5

//   const [visibleValueIndex, setVisibleValueIndex] = useState(minIndex);
//   const [touchStartY, setTouchStartY] = useState(null);
//   const scrollableDivRef = useRef(null);

//   const translateY = -1 * parseInt(visibleValueIndex) * itemHeightInPx;
//   console.log({ selectedValue: inputArr[parseInt(visibleValueIndex)] });
//   console.log({ selectedValue: parseInt(visibleValueIndex) });

//   const handleTouchStart = (event) => {
//     const { clientY } = event.touches[0];
//     setTouchStartY(clientY);
//   };

//   const handleTouchMove = (event) => {
//     if (touchStartY !== null) {
//       const { clientY } = event.touches[0];
//       const step = clientY - touchStartY > 0 ? -stepSize : stepSize;
//       const temp = Math.min(
//         maxIndex,
//         Math.max(minIndex, visibleValueIndex + step)
//       );
//       if (Math.abs(parseInt(visibleValueIndex) - parseInt(temp)) === 1)
//         audio.play();
//       setVisibleValueIndex(temp);
//       setTouchStartY(clientY);
//     }
//   };

//   const handleWheel = (event) => {
//     event.preventDefault();
//     const step = event.deltaY < 0 ? -wheelStep : wheelStep;
//     const temp = Math.min(
//       maxIndex,
//       Math.max(minIndex, visibleValueIndex + step)
//     );
//     if (Math.abs(parseInt(visibleValueIndex) - parseInt(temp)) === 1)
//       audio.play();
//     setVisibleValueIndex(temp);
//   };

//   useEffect(() => {
//     const scrollableDiv = scrollableDivRef.current;

//     if (scrollableDiv) {
//       scrollableDiv.addEventListener("touchstart", handleTouchStart);
//       scrollableDiv.addEventListener("touchmove", handleTouchMove);
//       scrollableDiv.addEventListener("wheel", handleWheel);

//       return () => {
//         scrollableDiv.removeEventListener("touchstart", handleTouchStart);
//         scrollableDiv.removeEventListener("touchmove", handleTouchMove);
//         scrollableDiv.removeEventListener("wheel", handleWheel);
//       };
//     }
//   }, [visibleValueIndex, touchStartY]);

//   return (
//     <div ref={scrollableDivRef} className={`flex flex-row gap-6 items-center`}>
//       <div className="flex gap-3 justify-center items-center">
//         <div
//           className={`w-fit px-4 h-[${itemHeightInRem}rem] rounded-[0.94rem]
//           resize-none focus:outline-none outline-none overflow-y-hidden
//           bg-gradient-to-b from-[#A8C3EF1A] via-[#A8C3EF] to-[#A8C3EF1A]`}
//           style={{ height: `${itemHeightInRem}rem` }}
//         >
//           <div
//             className="w-full h-full transform transition-transform duration-300
//           ease-in-out"
//             style={{ transform: `translateY(${translateY}px)` }}
//           >
//             {inputArr.map((item, index) => (
//               <p
//                 key={index}
//                 className={`flex justify-center text-[#4135F3] leading-normal
//                 text-[${itemHeightInRem / 1.5}rem]`}
//               >
//                 {item.split(" ")[0]}
//               </p>
//             ))}
//           </div>
//         </div>
//         <p className="text-[2.25rem] font-extrabold text-[#4135F3]">:</p>
//         <div
//           className={`w-fit px-4 h-[${itemHeightInRem}rem] rounded-[0.94rem]
//           resize-none focus:outline-none outline-none overflow-y-hidden
//           bg-gradient-to-b from-[#A8C3EF1A] via-[#A8C3EF] to-[#A8C3EF1A]`}
//           style={{ height: `${itemHeightInRem}rem` }}
//         >
//           <div
//             className="w-full h-full transform transition-transform duration-300
//           ease-in-out"
//             style={{ transform: `translateY(${translateY}px)` }}
//           >
//             {inputArr.map((item, index) => (
//               <p
//                 key={index}
//                 className={`flex justify-center text-[#4135F3] leading-normal
//                 text-[${itemHeightInRem / 1.5}rem]`}
//               >
//                 {item.split(" ")[1]}
//               </p>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div
//         className={`w-fit px-4 h-[${itemHeightInRem}rem] rounded-[0.94rem]
//         resize-none focus:outline-none outline-none overflow-y-hidden
//         bg-gradient-to-b from-[#A8C3EF1A] via-[#A8C3EF] to-[#A8C3EF1A]`}
//         style={{ height: `${itemHeightInRem}rem` }}
//       >
//         <div
//           className={`w-full h-full transform transition-transform duration-300
//           ease-in-out`}
//           style={{ transform: `translateY(${translateY}px)` }}
//         >
//           {inputArr.map((item, index) => (
//             <p
//               key={index}
//               className={`flex justify-center text-[#4135F3] leading-normal
//                 text-[${itemHeightInRem / 1.5}rem]`}
//             >
//               {item.split(" ")[2]}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TimePicker;
