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
      className="rounded-xl py-4 px-6 w-fit h-fit flex gap-x-8 justify-center items-center"
      style={{
        boxShadow:
          "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* images */}
      <div className="flex justify-center items-center w-[460px] aspect-square">
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
          // className="rounded-2xl mySwiper"
          className="mySwiper"
        >
          {venueDetails.images.map((image, id) => (
            <SwiperSlide key={id}>
              <img src={image.url} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* function hall info */}
      <div className="flex flex-col gap-y-8 justify-center items-start">
        <div className="w-full flex justify-between items-end">
          {/* function hall name & address */}
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-gradient text-[2rem] w-fit !font-['Open_Sans']">
              {venueDetails.name}
            </h1>
            <p className="text-[1rem] font-montserrat">
              {`${venueDetails.address.street}, ${venueDetails.address.landmark}`}
            </p>
            <div className="flex gap-2">
              <p className="text-[1rem] font-montserrat">Manager Number : </p>
              <p className="text-[1rem] font-montserrat text-[#4135F3]">
                +91 {venueDetails.manager.contactNumber}
              </p>
            </div>
          </div>
          {/* venue rating */}
          <div
            className="flex justify-center items-center px-4 py-2 gap-2 
              rounded-[0.625rem] bg-[#74B182]"
          >
            <img src={Star} />
            <p className="text-white font-inter">
              3.7 / 5 | <span className="opacity-50">28</span>
            </p>
          </div>
        </div>
        {/* function hall summary */}
        <p className="text-[1rem] font-montserrat">
          {venueDetails.aboutVenue}
          <b className="cursor-pointer"> Read More</b>
        </p>
        {/* important function hall information */}
        <div className="flex justify-center items-center gap-16">
          <div className="flex justify-center flex-col items-start">
            <p className="text-[1.5rem] text-[#4135F3] font-accent">
              Price : {venueDetails.venuePricePerDay} INR per day
            </p>
            <p className="text-[1.5rem] text-[#4135F3] font-accent">
              Capacity : {venueDetails.guestCapacity} Guests
            </p>
          </div>
          <div className="flex justify-center flex-col items-start">
            <p className="text-[1.5rem] text-[#4135F3] font-accent">
              Parking Space : {venueDetails.carParkingSpace} Cars
            </p>
            <p className="text-[1.5rem] text-[#4135F3] font-accent">
              Lodging Facility : {venueDetails.numOfLodgingRooms} Rooms
            </p>
          </div>
        </div>
        {/* virtual tour */}
        <div
          className="flex gap-x-5 justify-center items-center px-4
            rounded-[0.625rem] border border-[#4135F3] cursor-pointer"
        >
          <p className="text-[1.5rem] text-[#4135F3] font-bold font-accent">
            Virtual Tour
          </p>
          <img src={Camera} />
        </div>
        {/* food info and chack availability button */}
        <div className="flex w-full justify-between items-center">
          {/* food info */}
          <div className="flex flex-col">
            <div className="flex gap-x-2 items-center">
              <img src={VegMeal} />
              <p className="font-montserrat text-[1rem]">
                Vegetarian{" "}
                <b className="text-[1.5rem]">
                  ₹ {venueDetails.food.vegPricePerPlate}
                </b>{" "}
                / Plate
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <img src={NonVegMeal} />
              <p className="font-montserrat text-[1rem]">
                Non Vegetarian{" "}
                <b className="text-[1.5rem]">
                  ₹ {venueDetails.food.nonvegPricePerPlate}
                </b>{" "}
                / Plate
              </p>
            </div>
          </div>
          <SecondFancyBTN text="Check Availability" onClick={onClick} />
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
