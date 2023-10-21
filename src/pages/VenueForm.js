// importing from packages
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// importing components
import TextInputField from "../components/core/VenueForm/TextInputField";
import FirstFancyBTN from "../components/common/FirstFancyBTN";
import CheckboxInputField from "../components/core/VenueForm/CheckboxInputField";
import Upload from "../components/core/VenueForm/Upload";
import schema from "../components/core/VenueForm/YupSchema";
import TextAreaInputField from "../components/core/VenueForm/TextAreaInputField";

// API call related imports
import { createVenue, editVenue } from "../services/operations/venueAPI";

// importing utility functions
import { getCurrentLocation } from "../utils/utilities";

const VenueForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { venue } = useSelector((state) => state.venue);

  // console.log(venue);

  const [areImagesUpdated, setAreImagesUpdated] = useState(false);
  const [areVideosUpdated, setAreVideosUpdated] = useState(false);

  const defaultValues = { ...venue };
  ["manager", "status", "_id"].forEach((key) => delete defaultValues[key]);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const isFormDataUpdated = (data) => {
    if (areImagesUpdated || areVideosUpdated) return true;
    for (const key in data) {
      if (!["images", "videos"].includes(key) && data[key] !== venue[key]) {
        console.log("this got updated", key);
        console.log(data[key], venue[key]);
        return true;
      }
    }
    return false;
  };

  const createUpdatedFormData = (data) => {
    console.log("Started Creating updated Form");
    const formData = new FormData();
    formData.append("venueId", venue._id);
    if (areImagesUpdated) {
      for (const iterator of data?.images) formData.append("images", iterator);
    }
    if (areVideosUpdated) {
      for (const iterator of data?.videos) formData.append("videos", iterator);
    }
    for (const key in data) {
      if (!["images", "videos"].includes(key) && data[key] !== venue[key])
        formData.append(key, data[key]);
    }
    return formData;
  };

  const createFormData = (data) => {
    const formData = new FormData();
    // Append the images and videos with their respective field names
    for (const iterator of data.images) formData.append("images", iterator);
    for (const iterator of data.videos) formData.append("videos", iterator);
    for (const key in data) {
      if (!["images", "videos"].includes(key)) formData.append(key, data[key]);
    }
    return formData;
  };

  const onSubmit = (data) => {
    // if venue is null
    if (!venue) {
      // make a createVenue API call
      dispatch(createVenue(createFormData(data), navigate, token));
      // if venue exists
    } else {
      // Check whether the data is updated or not
      if (isFormDataUpdated(data)) {
        // if updated then make an editVenue API call
        // Display the values
        // for (const value of createUpdatedFormData(data).values())
        //   console.log(value);
        dispatch(editVenue(createUpdatedFormData(data), navigate, token));
      } else {
        // if not updated create toast to say it
        toast.error("No changes made to the form");
      }
    }
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContentTab mx-auto flex flex-col 
      justify-center gap-y-8"
    >
      <h1 className="font-inter text-3xl font-bold text-center text-[#4135F3]">
        {`${venue ? "Update" : "Register"} Your Function Hall Details`}
      </h1>
      <form
        className="flex flex-col justify-center gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="Name of the Venue (example KTR Function Hall)"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "name",
              inTagPlaceholder: "Enter Your Venue Name",
            },
          ]}
        />
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="Advance Payment Percentage 0 - 100 (example 45)"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "advancePercentage",
              inTagPlaceholder: "Enter Percentage Value",
            },
          ]}
        />
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="Guest Capacity (example 500)"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "guestCapacity",
              inTagPlaceholder: "Number of Guests Venue can Accommodate",
            },
          ]}
        />
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="How many Cars can be Parked in your Parking Space? (example 500)"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "carParkingSpace",
              inTagPlaceholder:
                "Number of Cars Your Parking Space can Accommodate",
            },
          ]}
        />
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="Function Hall Price Per Day including all Fixed Charges? (example 1,00,000)"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "venuePricePerDay",
              inTagPlaceholder: "Function Hall Price Per Day",
            },
          ]}
        />
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="Venue Lodging Facility Details"
          inTagsNamePlaceholderObject={[
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
          label="Booking Cancellation Details"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "isBookingCancellable",
              inTagplaceholder: "Booking is Cancellable",
            },
            {
              inTagName: "cancellationCharges",
              inTagplaceholder: "Cancellation Charges Applicable",
            },
          ]}
        />
        <CheckboxInputField
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
          label="Alcohol Consumption in the Venue Details"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "isItAllowed",
              inTagplaceholder: "Consumption of Alcohol is Allowed the Venue",
            },
            {
              inTagName: "isAlcoholProvidedByVenue",
              inTagplaceholder: "Alcohol is Provided By the Venue",
            },
            {
              inTagName: "outsideAlcoholAllowingCharges",
              inTagplaceholder:
                "Extra Charges will be Applicable if you bring Outside Alcohol",
            },
            {
              inTagName: "isOutsideAlcoholAllowed",
              inTagplaceholder: "Outside Alcohol is Allowed in the Venue",
            },
          ]}
        />
        <CheckboxInputField
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
          label="Caterers with Venue Tieup Details"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "isNonVegAllowedAtVenue",
              inTagplaceholder: "Eating Non-Veg is allowed in the Venue",
            },
            {
              inTagName: "isOutsideCatererAllowed",
              inTagplaceholder: "Outside Caterers are allowed",
            },
            {
              inTagName: "outsideCatererAllowingCharges",
              inTagplaceholder:
                "Extra Charges will be Applicable if you bring Outside Caterers",
            },
            {
              inTagName: "isCateringProvidedByVenue",
              inTagplaceholder:
                "We have Tieups with Caterers. We Provide Food for your Occation",
            },
          ]}
        />
        <div className="-mt-3">
          <TextInputField
            trigger={trigger}
            getValues={getValues}
            errors={errors}
            register={register}
            label=""
            inTagsNamePlaceholderObject={[
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
          label="Decorators with Venue Tieup Details"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "isOutsideDecoratersAllowed",
              inTagplaceholder: "Outside Decorators are Allowed",
            },
            {
              inTagName: "outsideDecorAllowingCharges",
              inTagplaceholder:
                "Extra Charges will be Applicable if you bring Outside Decoraters",
            },
            {
              inTagName: "isDecorProvidedByVenue",
              inTagplaceholder:
                "We have Tieups with Decoraters. We Provide Decoration for your Occation",
            },
          ]}
        />
        <CheckboxInputField
          getValues={getValues}
          errors={errors}
          register={register}
          setValue={setValue}
          label="Other Policies"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "isMusicAllowedLateAtNight",
              inTagplaceholder: "Music Allowed Late in the Night",
            },
            {
              inTagName: "isHallAirConditioned",
              inTagplaceholder: "Hall is Completely Air Conditioned",
            },
            {
              inTagName: "isBaaratAllowed",
              inTagplaceholder: "Baarat is Allowed",
            },
            {
              inTagName: "areFireCrackersAllowed",
              inTagplaceholder: "Fire Crackers are allowed",
            },
            {
              inTagName: "isHawanAllowed",
              inTagplaceholder: "Hawan is Allowed",
            },
            {
              inTagName: "isOverNightWeddingAllowed",
              inTagplaceholder: "OverNight wedding is Allowed",
            },
          ]}
        />
        <TextAreaInputField
          register={register}
          errors={errors}
          label="Describe Your Function Hall Briefly"
          name="aboutVenue"
          placeholder="Type Your Description Here. Describe Uniqueness, Beauty and other Qualities that Makes 
          your Function Hall Different from others. Make it as Brief and Crisp, 
          So that your Venue Customers can read it Completely and make Decisions 
          Accordingly."
        />
        <TextInputField
          trigger={trigger}
          getValues={getValues}
          errors={errors}
          register={register}
          label="Address of Your Function Hall"
          inTagsNamePlaceholderObject={[
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
        <div
          className="-mt-3"
          onClick={() => getCurrentLocation({ setValue, trigger })}
        >
          <TextInputField
            trigger={trigger}
            getValues={getValues}
            errors={errors}
            register={register}
            label=""
            inTagsNamePlaceholderObject={[
              {
                inTagName: "longitude",
                inTagPlaceholder: "Click Here to Fetch Venue Latitude",
              },
              {
                inTagName: "latitude",
                inTagPlaceholder: "Click Here to Fetch Venue Longitude",
              },
            ]}
          />
        </div>
        <Upload
          label="Add Function Hall Virtual Tour Video"
          name="videos"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={venue ? venue?.videos[0].url : null}
          video={true}
          setState={setAreVideosUpdated}
        />
        <Upload
          label="Add Your Function Hall Best Images (at least 10)"
          name="images"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={venue ? venue?.images[0].url : null}
          video={false}
          setState={setAreImagesUpdated}
        />
        <div className="mt-16 mx-auto">
          <FirstFancyBTN text={`${!venue ? "Save" : "Update"} Venue Details`} />
        </div>
      </form>
    </div>
  );
};

export default VenueForm;
