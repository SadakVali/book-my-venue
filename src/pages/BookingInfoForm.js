// importing from packages
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

// importing components
import TextInputField from "../components/core/VenueForm/TextInputField";
import SecondFancyBTN from "../components/common/SecondFancyBTN";

// API call related imports
import { createVenue, editVenue } from "../services/operations/venueAPI";

const schema = yup.object({
  customerName: yup
    .string()
    .required("Customer Name is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  customerContactNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number is not valid"),
  confirmCustomerContactNumber: yup
    .string()
    .oneOf(
      [yup.ref("customerContactNumber"), null],
      "Contact Number must match"
    ),
  advancePaid: yup
    .number()
    .required("Field is Required")
    .min(0, "Should be >= 0"),
  totalAmount: yup
    .number()
    .required("Field is Required")
    .min(0, "Should be >= 0"),
  checkInTime: yup
    .string()
    .required("Field is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  checkOutTime: yup
    .string()
    .required("Field is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
});

const BookingInfoForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { venue } = useSelector((state) => state.venue);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      checkInTime: "03 : 00 PM on 16/12/2023",
      checkOutTime: "04 : 00 PM on 18/12/2023",
    },
  });

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
    // dispatch(createVenue(createFormData(data), navigate, token));
    console.log(data);
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContentTab mx-auto flex flex-col 
      justify-center gap-y-8"
    >
      <form
        className="flex flex-col justify-center gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Customer Full Name"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "customerName",
              inTagPlaceholder: "Enter Customer Full Name",
            },
          ]}
        />
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Customer Contact Number"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "customerContactNumber",
              inTagPlaceholder: "Enter Customer Contact Number",
            },
          ]}
        />
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Confirm Contact Number"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "confirmCustomerContactNumber",
              inTagPlaceholder: "Confirm Customer Contact Number",
            },
          ]}
        />
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Total Amount"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "totalAmount",
              inTagPlaceholder: "Enter Total Amount of the Booking",
            },
          ]}
        />
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Advance Recieved"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "advancePaid",
              inTagPlaceholder: "Enter Adavance Recieved From The Customer",
            },
          ]}
        />
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Check In"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "checkInTime",
              inTagPlaceholder: "",
            },
          ]}
        />
        <TextInputField
          getValues={getValues}
          errors={errors}
          register={register}
          trigger={trigger}
          label="Check Out"
          inTagsNamePlaceholderObject={[
            {
              inTagName: "checkOutTime",
              inTagPlaceholder: "",
            },
          ]}
        />
        <div className="mt-16 mx-auto">
          <SecondFancyBTN text="Create New Booking" />
        </div>
      </form>
    </div>
  );
};

export default BookingInfoForm;
