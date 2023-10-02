import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import TextInputField from "../components/core/VenueForm/TextInputField";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FirstFancyBTN from "../components/common/FirstFancyBTN";
import CheckboxInputField from "../components/core/VenueForm/CheckboxInputField";

const VenueForm = () => {
  const { user } = useSelector((state) => state.user);

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
      name: "",
      advancePercentage: "",
      guestCapacity: "",
      carParkingSpace: "",
      numOfLodgingRooms: "",
      lodgingRoomPrice: "",
      street: "",
      landmark: "",
      distanceFromLandmark: "",
      village: "",
      city: "",
      pin: "",
      cancellation: false,
      cancellationCharges: false,
      isItAlloved: false,
      isAlcoholProvidedByVenue: false,
      isOutsideAlcoholAllowed: false,
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
          inTagDisabledState={false}
          inTagsNamePlaceholderObject={[
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
          inTagDisabledState={false}
          inTagsNamePlaceholderObject={[
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
          inTagDisabledState={false}
          inTagsNamePlaceholderObject={[
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
          inTagDisabledState={false}
          inTagsNamePlaceholderObject={[
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
          label="How many Cars can be Parked in your Parking Space? (example 500)"
          inTagDisabledState={false}
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
          errors={errors}
          register={register}
          title="Booking Cancellation Details"
          inTagDisabledState={false}
          inTagsNameLabelObject={[
            {
              inTagName: "cancellation",
              label: "Cancellable",
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
          inTagDisabledState={false}
          inTagsNameLabelObject={[
            {
              inTagName: "isItAlloved",
              label: "Do You Allow Consumption of Alcohol in the venue?",
            },
            {
              inTagName: "isAlcoholProvidedByVenue",
              label: "Allowed & Alcohol is Provided By the Venue",
            },
            {
              inTagName: "isOutsideAlcoholAllowed",
              label: "Outside Alcohol is Allowed in the Venue",
            },
          ]}
        />
        <TextInputField
          errors={errors}
          register={register}
          label="Address of Your Function Hall"
          inTagDisabledState={false}
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
        <div className="mt-16 mx-auto">
          <FirstFancyBTN text="Save" />
        </div>
      </form>
    </div>
  );
};

export default VenueForm;
