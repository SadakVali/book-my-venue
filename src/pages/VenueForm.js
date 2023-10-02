import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ReactComponent as Tick } from "../assets/Icons/Tick.svg";
import { useState } from "react";

const VenueForm = () => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ mode: "onBlur" });

  const onSubmit = (data) => {
    console.log("Hi Buddy");
    console.log(data);
  };

  const [nameFlag, setNameFlag] = useState(false);

  return (
    <div
      className="my-12 w-11/12 max-w-maxContent mx-auto flex flex-col 
      justify-center gap-y-8"
    >
      {!user?.venue && (
        <h1 className="font-inter text-3xl font-bold text-center text-[#28374B]">
          Register Your Function Hall Details
        </h1>
      )}
      {user?.venue && (
        <h1 className="font-inter text-3xl font-bold text-center text-[#28374B]">
          Update Your Function Hall Details
        </h1>
      )}
      <form
        className="flex flex-col justify-center gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="flex flex-col gap-4">
          <p
            className={`${
              errors.name ? "text-[#FD2727]" : "text-[#949BA5]"
            } text-[1rem]`}
          >
            Name of the Function Hall
          </p>
          <div className="flex flex-col gap-x-2">
            <div className="mr-4 flex justify-between items-center gap-4">
              <input
                required
                type="text"
                name="name"
                onMouseLeave={() => setNameFlag(true)}
                // onBlur={() => setNameFlag(true)}
                placeholder="Enter Your Full Name"
                className="w-full bg-transparent border-nonefocus:border-none 
                  focus:outline-none text-[#28374B] placeholder-[#28374B] 
                  text-[1.25rem]"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Please Enter You Full Name",
                  },
                  minLength: {
                    value: 3,
                    message: "Name should consists of atleast 3 characters",
                  },
                })}
              />
              {!errors.name && nameFlag && <Tick />}
            </div>
            <div
              className={`${
                errors.name ? "bg-[#FD2727]" : "bg-[#4135F3]"
              } h-[0.0625rem]`}
            ></div>
            {errors.name && (
              <p className="text-[1rem] text-[#FD2727]">
                {errors.name.message}
              </p>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-4">
          <p
            className={`${
              errors.advancePercentage ? "text-[#FD2727]" : "text-[#949BA5]"
            } text-[1rem]`}
          >
            Advance Payment Percentage (example 45%)
          </p>
          <div className="flex flex-col gap-x-2">
            <div className="mr-4 flex justify-between items-center gap-4">
              <input
                required
                type="text"
                name="advancePercentage"
                placeholder="Enter Percentage Value"
                className="w-full bg-transparent border-nonefocus:border-none 
                  focus:outline-none text-[#28374B] placeholder-[#28374B] 
                  text-[1.25rem]"
                {...register("advancePercentage", {
                  required: {
                    value: true,
                    message: "Please Enter You Full Name",
                  },
                  minLength: {
                    value: 3,
                    message:
                      "Please Enter Function Hall Advance Percentage Value",
                  },
                })}
              />
              {!errors.advancePercentage && getValues("advancePercentage") && (
                <Tick />
              )}
            </div>
            <div
              className={`${
                errors.advancePercentage ? "bg-[#FD2727]" : "bg-[#4135F3]"
              } h-[0.0625rem]`}
            ></div>
            {errors.advancePercentage && (
              <p className="text-[1rem] text-[#FD2727]">
                {errors.advancePercentage.message}
              </p>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-4">
          <p
            className={`${
              errors.guestCapacity ? "text-[#FD2727]" : "text-[#949BA5]"
            } text-[1rem]`}
          >
            Guest Capacity
          </p>
          <div className="flex flex-col gap-x-2">
            <div className="mr-4 flex justify-between items-center gap-4">
              <input
                required
                type="text"
                name="guestCapacity"
                placeholder="Number of Guests Venue can Accommodate"
                className="w-full bg-transparent border-nonefocus:border-none 
                  focus:outline-none text-[#28374B] placeholder-[#28374B] 
                  text-[1.25rem]"
                {...register("guestCapacity", {
                  required: {
                    value: true,
                    message: "Please Enter Function Hall Guest Capacity",
                  },
                })}
              />
              {!errors.guestCapacity && getValues("guestCapacity") && <Tick />}
            </div>
            <div
              className={`${
                errors.guestCapacity ? "bg-[#FD2727]" : "bg-[#4135F3]"
              } h-[0.0625rem]`}
            ></div>
            {errors.guestCapacity && (
              <p className="text-[1rem] text-[#FD2727]">
                {errors.guestCapacity.message}
              </p>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-4">
          <p
            className={`${
              errors.carParkingSpace ? "text-[#FD2727]" : "text-[#949BA5]"
            } text-[1rem]`}
          >
            How many Cars can be Parked in your Parking Space?
          </p>
          <div className="flex flex-col gap-x-2">
            <div className="mr-4 flex justify-between items-center gap-4">
              <input
                required
                type="text"
                name="carParkingSpace"
                placeholder="Number of Cars Venue Parking Space can Accommodate"
                className="w-full bg-transparent border-nonefocus:border-none 
                  focus:outline-none text-[#28374B] placeholder-[#28374B] 
                  text-[1.25rem]"
                {...register("carParkingSpace", {
                  required: {
                    value: true,
                    message: "Please Enter Function Hall Parking Area Capacity",
                  },
                })}
              />
              {!errors.carParkingSpace && getValues("carParkingSpace") && (
                <Tick />
              )}
            </div>
            <div
              className={`${
                errors.carParkingSpace ? "bg-[#FD2727]" : "bg-[#4135F3]"
              } h-[0.0625rem]`}
            ></div>
            {errors.carParkingSpace && (
              <p className="text-[1rem] text-[#FD2727]">
                {errors.carParkingSpace.message}
              </p>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-4">
          <p
            className={`${
              errors.carParkingSpace ? "text-[#FD2727]" : "text-[#949BA5]"
            } text-[1rem]`}
          >
            Lodging Rooms in the Venue
          </p>
          <div className="ml-4 flex flex-col gap-y-3">
            <div className="flex flex-col gap-x-2">
              <div className="mr-4 flex justify-between items-center gap-4">
                <input
                  required
                  type="text"
                  name="numOfLodgingRooms"
                  placeholder="Number of Lodging Rooms in the Venue"
                  className="w-full bg-transparent border-nonefocus:border-none 
                  focus:outline-none text-[#28374B] placeholder-[#28374B] 
                  text-[1.25rem]"
                  {...register("numOfLodgingRooms", {
                    required: {
                      value: true,
                      message:
                        "Please Enter the Number of Rooms Available in the Function Hall",
                    },
                  })}
                />
                {!errors.numOfLodgingRooms &&
                  getValues("numOfLodgingRooms") && <Tick />}
              </div>
              <div
                className={`${
                  errors.numOfLodgingRooms ? "bg-[#FD2727]" : "bg-[#4135F3]"
                } h-[0.0625rem]`}
              ></div>
              {errors.numOfLodgingRooms && (
                <p className="text-[1rem] text-[#FD2727]">
                  {errors.numOfLodgingRooms.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-x-2">
              <div className="mr-4 flex justify-between items-center gap-4">
                <input
                  required
                  type="text"
                  name="lodgingRoomPrice"
                  placeholder="Price of each Room in the Venue"
                  className="w-full bg-transparent border-nonefocus:border-none 
                  focus:outline-none text-[#28374B] placeholder-[#28374B] 
                  text-[1.25rem]"
                  {...register("lodgingRoomPrice", {
                    required: {
                      value: true,
                      message: "Please Enter Each Room Price Per Day",
                    },
                  })}
                />
                {!errors.lodgingRoomPrice && getValues("lodgingRoomPrice") && (
                  <Tick />
                )}
              </div>
              <div
                className={`${
                  errors.lodgingRoomPrice ? "bg-[#FD2727]" : "bg-[#4135F3]"
                } h-[0.0625rem]`}
              ></div>
              {errors.lodgingRoomPrice && (
                <p className="text-[1rem] text-[#FD2727]">
                  {errors.lodgingRoomPrice.message}
                </p>
              )}
            </div>
          </div>
        </label>

        {/* <button type="submit">send</button> */}
      </form>
    </div>
  );
};

export default VenueForm;
