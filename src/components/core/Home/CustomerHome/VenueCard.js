import SecondFancyBTN from "../../../common/SecondFancyBTN";

import Star from "../../../../assets/Icons/Star.png";
import Camera from "../../../../assets/Icons/Camera.png";
import NonVegMeal from "../../../../assets/Icons/NonVegMeal.png";
import VegMeal from "../../../../assets/Icons/VegMeal.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useDispatch } from "react-redux";

import { setMyVenue } from "../../../../slices/customerSlice";
import { useNavigate } from "react-router-dom";

const VenueCard = ({ venueDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClick = () => {
    dispatch(setMyVenue(venueDetails._id));
    navigate(`/venues/${venueDetails._id}`);
  };

  return (
    <div
      className="rounded-xl xl:py-2 xl:px-3 w-fit h-fit flex gap-6 justify-center 
      items-center hover:cursor-pointer flex-col xl:flex-row"
      style={{
        boxShadow:
          "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
      onClick={onClick}
    >
      {/* images */}
      <div
        className="flex justify-center items-center h-[300px] w-[320px] sm:w-[510px] 
        xl:w-[420px]"
      >
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="rounded-2xl mySwiper"
        >
          {venueDetails.images.map((image, id) => (
            <SwiperSlide key={id}>
              <img
                src={image.url}
                className="w-[320px] sm:w-[510px] xl:w-[420px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* function hall info */}
      <div className="w-full flex flex-col gap-y-4 justify-center items-start">
        {/* <div className="w-full flex justify-between items-end"> */}
        <div className="w-full flex justify-between items-end px-4 pb-4">
          {/* function hall name & address */}
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-gradient text-[2rem] w-fit !font-['Open_Sans']">
              {venueDetails.name}
            </h1>
            <p className="text-[1rem] font-montserrat">
              {/* {`${venueDetails.address.street}, ${venueDetails.address.landmark}`} */}
              {venueDetails.address.street}
            </p>
            <div className="flex gap-2 flex-wrap">
              <p className="text-[1rem] font-montserrat">Manager Number : </p>
              <p className="text-[1rem] font-montserrat text-[#4135F3]">
                +91{" "}
                {venueDetails.manager.contactNumber.replace(/(\d{5})/g, "$1 ")}
              </p>
            </div>
          </div>
          {/* venue rating */}
          <div
            className="hidden sm:flex justify-center items-center px-4 py-2 gap-2 
            rounded-[0.625rem] bg-[#74B182]"
          >
            <img src={Star} />
            <p className="text-white font-inter">
              3.7 / 5 | <span className="opacity-50">28</span>
            </p>
          </div>
        </div>
        {/* function hall summary */}
        <p className="text-[1rem] font-montserrat max-w-lg xl:inline hidden">
          {venueDetails.aboutVenue.split(/\s+/).slice(0, 15).join(" ")}
          <b className="cursor-pointer"> ...Read More</b>
        </p>
        {/* important function hall information */}
        <div className="xl:flex hidden justify-center items-center gap-16">
          <div className="flex justify-center flex-col items-start">
            <p className="text-[1rem] text-[#28374B] font-montserrat">
              Price : {venueDetails.venuePricePerDay.toLocaleString("en-IN")}{" "}
              INR per day
            </p>
            <p className="text-[1rem] text-[#28374B] font-montserrat">
              Capacity : {venueDetails.guestCapacity.toLocaleString("en-IN")}{" "}
              Guests
            </p>
          </div>
          <div className="flex justify-center flex-col items-start">
            <p className="text-[1rem] text-[#28374B] font-montserrat">
              Parking Space :{" "}
              {venueDetails.carParkingSpace.toLocaleString("en-IN")} Cars
            </p>
            <p className="text-[1rem] text-[#28374B] font-montserrat">
              Lodging Facility :{" "}
              {venueDetails.numOfLodgingRooms.toLocaleString("en-IN")} Rooms
            </p>
          </div>
        </div>
        {/* food info and chack availability button */}
        <div className="xl:flex hidden w-full justify-between items-end">
          {/* food info */}
          <div className="flex flex-col">
            <div className="flex gap-x-2 items-center">
              <img src={VegMeal} />
              <p className="font-montserrat text-[1rem] flex justify-center items-center gap-x-2">
                Vegetarian{" "}
                <b className="text-[1.5rem]">
                  ₹ {venueDetails.food.vegPricePerPlate.toLocaleString("en-IN")}
                </b>{" "}
                / Plate
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <img src={NonVegMeal} />
              <p className="font-montserrat text-[1rem] flex justify-center items-center gap-x-2">
                Non Vegetarian{" "}
                <b className="text-[1.5rem]">
                  ₹{" "}
                  {venueDetails.food.nonvegPricePerPlate.toLocaleString(
                    "en-IN"
                  )}
                </b>{" "}
                / Plate
              </p>
            </div>
          </div>
          {/* virtual tour */}
          <div
            className="flex gap-x-5 justify-center items-center px-4 py-1
            rounded-[0.625rem] border border-[#4135F3] cursor-pointer"
          >
            <p className="text-[1rem] text-[#4135F3] font-montserrat">
              Virtual Tour
            </p>
            <img src={Camera} />
          </div>
          {/* <SecondFancyBTN text="Check Availability" onClick={onClick} /> */}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
