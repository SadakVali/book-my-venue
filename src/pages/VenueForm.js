import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TextInputField from "../components/core/VenueForm/TextInputField";
import { toast } from "react-hot-toast";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FirstFancyBTN from "../components/common/FirstFancyBTN";
import CheckboxInputField from "../components/core/VenueForm/CheckboxInputField";
import { useEffect, useState } from "react";

import Upload from "../components/core/VenueForm/Upload";
import { createVenue, editVenue } from "../services/operations/venueAPI";
import { useNavigate } from "react-router-dom";

const VenueForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const { venue } = useSelector((state) => state.venue);
  console.log(venue);

  const [areImagesUpdated, setAreImagesUpdated] = useState(false);
  const [areVideosUpdated, setAreVideosUpdated] = useState(false);

  // const flattenObject = (inputObj) => {
  //   const flatObj = {};
  //   for (const key in inputObj) {
  //     if (
  //       !["manager", "images", "videos", "allBookings", "status"].includes(key)
  //     ) {
  //       if (Array.isArray(inputObj[key]) && key === "coordinates") {
  //         flatObj["longitude"] = inputObj[key][0];
  //         flatObj["latitude"] = inputObj[key][1];
  //       } else if (
  //         typeof inputObj[key] === "object" &&
  //         inputObj[key] !== null
  //       ) {
  //         // Recursively flatten nested objects
  //         const nestedFlatObj = flattenObject(inputObj[key]);
  //         Object.assign(flatObj, nestedFlatObj);
  //       } else {
  //         // Add non-object values directly
  //         flatObj[key] = inputObj[key];
  //       }
  //     }
  //   }
  //   return flatObj;
  // };

  const schema = yup.object({
    name: yup
      .string()
      .required("Function Hall Name is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
    advancePercentage: yup
      .number()
      .required()
      .min(0, "Should be >= 0")
      .max(100, "It's a Percentage Value should be <= 100"),
    guestCapacity: yup.number().required().min(1, "Should be > 0"),
    carParkingSpace: yup.number().required().min(0, "Should be >= 0"),
    venuePricePerDay: yup.number().required().min(0, "Should be >= 0"),
    numOfLodgingRooms: yup.number().required().min(0, "Should be >= 0"),
    lodgingRoomPrice: yup.number().required().min(0, "Should be >= 0"),
    vegPricePerPlate: yup.number().required().min(0, "Should be >= 0"),
    nonvegPricePerPlate: yup.number().required().min(0, "Should be >= 0"),
    aboutVenue: yup
      .string()
      .required("About Function Hall Field is Required")
      .min(200, "Minimum 200 Characters Required")
      .trim(),
    street: yup
      .string()
      .required("Field is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
    landmark: yup
      .string()
      .required("Field is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
    distanceFromLandmark: yup
      .string()
      .required("Field is Required")
      .min(5, "Minimum 5 Characters Required")
      .trim(),
    village: yup
      .string()
      .required("Field is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
    city: yup
      .string()
      .required("Field is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
    pin: yup.number().required("Field is Required").min(0, "Must be > 0"),
    latitude: yup.number().required("Field is Required"),
    longitude: yup.number().required("Field is Required"),
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
    defaultValues: venue,
    // defaultValues: { cancellation: false, cancellationCharges: false },
  });

  const inTagDisabledState = !!venue;

  const [latitude, setLatitude] = useState(
    "Click Here to Fetch Venue Latitude"
  );
  const [longitude, setLongitude] = useState(
    "Click Here to Fetch Venue Longitude"
  );

  const [fetchedGPScoordinatesFlag, setFetchedGPScoordinatesFlag] =
    useState(false);

  console.log(getValues());

  const getCurrentLocation = () => {
    if (!fetchedGPScoordinatesFlag) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude((prev) => `${prev} ${position.coords.latitude}`);
            setLongitude((prev) => `${prev} ${position.coords.longitude}`);
            setFetchedGPScoordinatesFlag(true);
            setValue("latitude", position.coords.latitude);
            setValue("longitude", position.coords.longitude);
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
    }
  };

  const isDataUpdated = () => {
    if (areImagesUpdated || areVideosUpdated) return true;
    const currentValues = getValues();
    for (const key in currentValues) {
      // TODO: add longitude and latidude update verification
      if (!["images", "videos", "longitude", "latitude"].includes(key)) {
        if (currentValues[key] !== venue[key]) return true;
      }
    }
    return false;
  };

  const createUpdatedFormObject = () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("venueId", venue._id);
    if (areImagesUpdated) formData.append("images", currentValues["images"]);
    if (areVideosUpdated) formData.append("videos", currentValues["videos"]);

    if (
      currentValues["latitude"] !== venue["latitude"] ||
      currentValues["longitude"] !== venue["longitude"]
    )
      formData.append("coordinates", [
        currentValues["longitude"],
        currentValues["latitude"],
      ]);

    for (const key in currentValues) {
      if (!["images", "videos", "longitude", "latitude"].includes(key)) {
        if (currentValues[key] !== venue[key])
          formData.append(key, currentValues[key]);
      }
    }
    return formData;
  };

  const createFormData = (data) => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("coordinates", data.longitude);
    formData.append("coordinates", data.latitude);
    // Append the images and videos with their respective field names
    for (const iterator of data.images) formData.append("images", iterator);
    for (const iterator of data.videos) formData.append("videos", iterator);
    for (const key in currentValues) {
      if (!["images", "videos", "longitude", "latitude"].includes(key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  };

  const onSubmit = (data) => {
    // console.log("Hi Buddy");
    // console.log(data);
    // if venue is null
    if (!venue) {
      // console.log({ token });
      // make a createVenue API call
      // setValue(
      //   "coordinates",
      //   JSON.parse([getValues("longitude"), getValues("latitude")])
      // );
      // console.log("NOw see the cause");

      dispatch(createVenue(createFormData(data), navigate, token));
      // if venue exists
    } else {
      // Check whether the data is updated or not
      if (isDataUpdated()) {
        // if updated then make an editVenue API call
        const updatedFormObject = createUpdatedFormObject();
        dispatch(editVenue(updatedFormObject, navigate, token));
      } else {
        // if not updated create toast to say it
        toast.error("No changes made to the form");
      }
    }
    // reset();
  };

  // useEffect(() => {
  //   if (isSubmitSuccessful) reset();
  // }, [reset, isSubmitSuccessful]);

  return (
    <div
      className="my-16 w-11/12 max-w-maxContentTab mx-auto flex flex-col 
      justify-center gap-y-8"
    >
      <h1 className="font-inter text-3xl font-bold text-center text-[#28374B]">
        {`${!!!user?.venue ? "Register" : "Upadet"} Your Function Hall Details`}
      </h1>
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
          label="Advance Payment Percentage 0 - 100 (example 45)"
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
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
          title="Booking Cancellation Details"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "isBookingCancellable",
              label: "Booking is Cancellable",
            },
            {
              inTagName: "cancellationCharges",
              label: "Cancellation Charges Applicable",
            },
          ]}
        />
        <CheckboxInputField
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
          title="Alcohol Consumption in the Venue Details"
          inTagDisabledState={inTagDisabledState}
          inTagsNameLabelObject={[
            {
              inTagName: "isItAllowed",
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
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
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
          getValues={getValues}
          errors={errors}
          setValue={setValue}
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
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
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
            {...register("aboutVenue")}
          />
          {errors["aboutVenue"] && (
            <p className="text-[1rem] text-[#FD2727]">
              {errors["aboutVenue"].message}
            </p>
          )}
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
              inTagPlaceholder: "Distance from Landmark (ex 10 Mins or 2 Kms)",
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
        <div className="-mt-3" onClick={getCurrentLocation}>
          <TextInputField
            errors={errors}
            register={register}
            label=""
            inTagDisabledState={false}
            inTagsNamePlaceholderValueObject={[
              {
                inTagName: "longitude",
                inTagPlaceholder: longitude,
                inTagValue: longitude,
              },
              {
                inTagName: "latitude",
                inTagPlaceholder: latitude,
                inTagValue: latitude,
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-y-6">
          <p className="text-[#949BA5] text-[1rem]">
            Add Function Hall Virtual Tour Video
          </p>
          <div
            className="w-full min-h-[20rem] overflow-hidden rounded-[1.25rem] 
            flex flex-col justify-center items-center"
            style={{
              boxShadow:
                "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Upload
              name="videos"
              register={register}
              setValue={setValue}
              errors={errors}
              editData={venue?.videos[0].url || null}
              video={true}
              setState={setAreVideosUpdated}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-6">
          <p className="text-[#949BA5] text-[1rem]">
            Add Your Function Hall Best Images (at least 10)
          </p>
          <div
            className="w-full h-[20rem] rounded-[1.25rem] flex flex-col 
            justify-center items-center"
            style={{
              boxShadow:
                "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Upload
              name="images"
              register={register}
              setValue={setValue}
              errors={errors}
              editData={venue?.images[0].url || null}
              video={false}
              setState={setAreImagesUpdated}
            />
          </div>
        </div>

        <div className="mt-16 mx-auto">
          <FirstFancyBTN
            text={`${!!!venue ? "Save" : "Update"} Venue Details`}
          />
        </div>
      </form>
    </div>
  );
};

export default VenueForm;

// 5. connect the API to store the data into DB
// 7. Test run the Save and the Upload venue details routes
// 8. refactor the code into different sub sections
