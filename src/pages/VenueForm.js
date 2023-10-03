import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import TextInputField from "../components/core/VenueForm/TextInputField";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FirstFancyBTN from "../components/common/FirstFancyBTN";
import CheckboxInputField from "../components/core/VenueForm/CheckboxInputField";
import { useState } from "react";

const VenueForm = () => {
  const { user } = useSelector((state) => state.user);

  const inTagDisabledState = !!user.venue ? true : false;

  const [latitude, setLatitude] = useState("Your Venue Latitude : ");
  const [longitude, setLongitude] = useState("Your Venue Longitude : ");

  const [fetchGPScoordinatesFlag, setFetchGPScoordinatesFlag] = useState(false);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude((prev) => `${prev} ${position.coords.latitude}`);
          setLongitude((prev) => `${prev} ${position.coords.longitude}`);
          setFetchGPScoordinatesFlag(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("User denied the request for Geolocation.");
          } else {
            alert("An error occurred while getting your location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not available in your browser.");
    }
  };

  const schema = yup.object({
    name: yup
      .string()
      .required("Function Hall Name is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
    advancePercentage: yup.number().required().min(0).max(100),
    guestCapacity: yup.number().required().min(0),
    carParkingSpace: yup.number().required().min(0),
    numOfLodgingRooms: yup.number().required().min(0),
    lodgingRoomPrice: yup.number().required().min(0),
    street: yup.string().required().min(3),
    landmark: yup.string().required().min(3),
    distanceFromLandmark: yup.string().required().min(5),
    village: yup.string().required().min(3),
    city: yup.string().required().min(3),
    pin: yup.number().required().min(0),
    cancellation: yup.bool(),
    cancellationCharges: yup.bool(),
    isItAlloved: yup.bool(),
    isAlcoholProvidedByVenue: yup.bool(),
    isOutsideAlcoholAllowed: yup.bool(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: inTagDisabledState ? user.venue.name : "",
      advancePercentage: inTagDisabledState ? user.venue.advancePercentage : "",
      guestCapacity: inTagDisabledState ? user.venue.guestCapacity : "",
      carParkingSpace: inTagDisabledState ? user.venue.carParkingSpace : "",
      numOfLodgingRooms: inTagDisabledState ? user.venue.numOfLodgingRooms : "",
      lodgingRoomPrice: inTagDisabledState ? user.venue.lodgingRoomPrice : "",
      street: inTagDisabledState ? user.venue.street : "",
      landmark: inTagDisabledState ? user.venue.landmark : "",
      distanceFromLandmark: inTagDisabledState
        ? user.venue.distanceFromLandmark
        : "",
      village: inTagDisabledState ? user.venue.village : "",
      city: inTagDisabledState ? user.venue.city : "",
      pin: inTagDisabledState ? user.venue.pin : "",
      cancellation: inTagDisabledState ? user.venue.pin : false,
      cancellationCharges: inTagDisabledState
        ? user.venue.cancellationCharges
        : false,
      isItAlloved: inTagDisabledState ? user.venue.isItAlloved : false,
      isAlcoholProvidedByVenue: inTagDisabledState
        ? user.venue.isAlcoholProvidedByVenue
        : false,
      isOutsideAlcoholAllowed: inTagDisabledState
        ? user.venue.isOutsideAlcoholAllowed
        : false,
      latitude: inTagDisabledState ? user.venue.latitude : latitude,
      longitude: inTagDisabledState ? user.venue.longitude : longitude,
    },
  });

  const onSubmit = (data) => {
    console.log("Hi Buddy");
    console.log(data);
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContentTab mx-auto flex flex-col 
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
        <TextInputField
          errors={errors}
          register={register}
          label="Name of the Venue (example KTR Function Hall)"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "name",
              inTagPlaceholder: "Enter Your Venue Name",
            },
          ]}
        />
        <TextInputField
          errors={errors}
          register={register}
          label="Advance Payment Percentage (example 45%)"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "advancePercentage",
              inTagPlaceholder: "Enter Percentage Value",
            },
          ]}
        />
        <TextInputField
          errors={errors}
          register={register}
          label="Guest Capacity (example 500)"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "guestCapacity",
              inTagPlaceholder: "Number of Guests Venue can Accommodate",
            },
          ]}
        />
        <TextInputField
          errors={errors}
          register={register}
          label="How many Cars can be Parked in your Parking Space? (example 500)"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "carParkingSpace",
              inTagPlaceholder:
                "Number of Cars Your Parking Space can Accommodate",
            },
          ]}
        />
        <TextInputField
          errors={errors}
          register={register}
          label="Function Hall Price Per Day including all Fixed Charges? (example 1,00,000)"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "venuePricePerDay",
              inTagPlaceholder: "Function Hall Price Per Day",
            },
          ]}
        />
        <TextInputField
          errors={errors}
          register={register}
          label="How many Cars can be Parked in your Parking Space? (example 500)"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "numOfLodgingRooms",
              inTagPlaceholder: "Number of Lodging Rooms in the Venue",
            },
            {
              inTagName: "lodgingRoomPrice",
              inTagPlaceholder: "Price of each Room in the Venue",
            },
          ]}
        />
        <CheckboxInputField
          errors={errors}
          register={register}
          title="Booking Cancellation Details"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "cancellation",
              label: "Booking is Cancellable",
            },
            {
              inTagName: "cancellationCharges",
              label: "Cancellation Charges Applicable",
            },
          ]}
        />
        <CheckboxInputField
          errors={errors}
          register={register}
          title="Alcohol Consumption in the Venue Details"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "isItAlloved",
              label: "Consumption of Alcohol is Allowed the Venue",
            },
            {
              inTagName: "isAlcoholProvidedByVenue",
              label: "Alcohol is Provided By the Venue",
            },
            {
              inTagName: "outsideAlcoholAllowingCharges",
              label:
                "Extra Charges will be Applicable if you bring Outside Alcohol",
            },
            {
              inTagName: "isOutsideAlcoholAllowed",
              label: "Outside Alcohol is Allowed in the Venue",
            },
          ]}
        />
        <CheckboxInputField
          errors={errors}
          register={register}
          title="Caterers with Venue Tieup Details"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "isNonVegAllowedAtVenue",
              label: "Eating Non-Veg is allowed in the Venue",
            },
            {
              inTagName: "isOutsideCatererAllowed",
              label: "Outside Caterers are allowed",
            },
            {
              inTagName: "outsideCatererAllowingCharges",
              label:
                "Extra Charges will be Applicable if you bring Outside Caterers",
            },
            {
              inTagName: "isCateringProvidedByVenue",
              label:
                "We have Tieups with Caterers. We Provide Food for your Occation",
            },
          ]}
        />
        <div className="-mt-3">
          <TextInputField
            errors={errors}
            register={register}
            label=""
            inTagDisabledState={inTagDisabledState}
            inTagsNamePlaceholderValueObject={[
              {
                inTagName: "vegPricePerPlate",
                inTagPlaceholder:
                  "Venue Caterer Veg Food Price per Plate in INR",
              },
              {
                inTagName: "nonvegPricePerPlate",
                inTagPlaceholder:
                  "Venue Caterer Non-Veg Food Price per Plate in INR",
              },
            ]}
          />
        </div>
        <CheckboxInputField
          errors={errors}
          register={register}
          title="Decorators with Venue Tieup Details"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "isOutsideDecoratersAllowed",
              label: "Outside Decorators are Allowed",
            },
            {
              inTagName: "outsideDecorAllowingCharges",
              label:
                "Extra Charges will be Applicable if you bring Outside Decoraters",
            },
            {
              inTagName: "isDecorProvidedByVenue",
              label:
                "We have Tieups with Decoraters. We Provide Decoration for your Occation",
            },
          ]}
        />
        <CheckboxInputField
          errors={errors}
          register={register}
          title="Other Policies"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "isMusicAllowedLateAtNight",
              label: "Music Allowed Late in the Night",
            },
            {
              inTagName: "isHallAirConditioned",
              label: "Hall is Completely Air Conditioned",
            },
            {
              inTagName: "isBaaratAllowed",
              label: "Baarat is Allowed",
            },
            {
              inTagName: "areFireCrackersAllowed",
              label: "Fire Crackers are allowed",
            },
            {
              inTagName: "isHawanAllowed",
              label: "Hawan is Allowed",
            },
            {
              inTagName: "isOverNightWeddingAllowed",
              label: "OverNight wedding is Allowed",
            },
          ]}
        />

        <div className="flex flex-col gap-y-6">
          <p className="text-[#949BA5] text-[1rem]">
            Describe Your Function Hall Briefly
          </p>
          <textarea
            name="aboutVenue"
            disabled={inTagDisabledState}
            placeholder="Type Your Description Here. Describe Uniqueness, Beauty and other Qualities that Makes 
            your Function Hall Different from others. Make it as Brief and Crisp, 
            So that your Venue Customers can read it Completely and make Decisions 
            Accordingly."
            className="bg-white rounded-xl p-4 w-full h-[10rem] outline-none
            overflow-y-auto resize-none focus:outline-none placeholder:text-[1rem] 
            placeholder:text-[#949BA5] text-[#28374B] text-[1.25rem]"
            // style={{
            //   scrollbarWidth: "thin",
            //   scrollbarColor: "transparent transparent",
            // }}
            style={{
              boxShadow:
                "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          />
        </div>

        <TextInputField
          errors={errors}
          register={register}
          label="Address of Your Function Hall"
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={[
            {
              inTagName: "street",
              inTagPlaceholder: "Area / Street",
            },
            {
              inTagName: "landmark",
              inTagPlaceholder: "Landmark",
            },
            {
              inTagName: "distanceFromLandmark",
              inTagPlaceholder: "Distance from Landmark",
            },
            {
              inTagName: "village",
              inTagPlaceholder: "Village / Town",
            },
            {
              inTagName: "city",
              inTagPlaceholder: "Town / City",
            },
            {
              inTagName: "pin",
              inTagPlaceholder: "Pincode",
            },
          ]}
        />
        <div className="-mt-3">
          <TextInputField
            errors={errors}
            register={register}
            label=""
            // disabled true always
            inTagDisabledState={inTagDisabledState}
            inTagsNamePlaceholderValueObject={[
              {
                inTagName: "longitude",
                inTagPlaceholder: "",
                inTagValue: longitude,
              },
              {
                inTagName: "latitude",
                inTagPlaceholder: "",
                inTagValue: latitude,
              },
            ]}
          />
        </div>

        {!fetchGPScoordinatesFlag && (
          <div className="flex justify-center">
            <FirstFancyBTN
              text="Fetch Venue GPS Coordinates"
              onClick={getCurrentLocation}
            ></FirstFancyBTN>
          </div>
        )}

        <div className="flex flex-col gap-y-6">
          <p className="text-[#949BA5] text-[1rem]">
            Add Function Hall Virtual Tour Video
          </p>
          <div
            className="w-full h-[20rem] rounded-[1.25rem]"
            style={{
              boxShadow:
                "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          ></div>
        </div>

        <div className="flex flex-col gap-y-6">
          <p className="text-[#949BA5] text-[1rem]">
            Add Your Function Hall Best Images (at least 10)
          </p>
          <div
            className="w-full h-[20rem] rounded-[1.25rem]"
            style={{
              boxShadow:
                "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          ></div>
        </div>

        <div className="mt-16 mx-auto">
          <FirstFancyBTN text="Save Venue Details" />
        </div>
      </form>
    </div>
  );
};

export default VenueForm;

// 2. populate the input field and make them non-editable
// 3. create a button to make the data editable & to update the venue details
// 4. connect the API to store the data into DB
// 5. add yup validations
// 6. understand the image and video addition code from the StudyNotion Project
// 7. Test run the Save and the Upload venue details routes
