import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SecondFancyBTN from "../../common/SecondFancyBTN";
import TextInputField from "../VenueForm/TextInputField";

import { useDispatch } from "react-redux";
import { fetchSingleCustomerReciepts } from "../../../services/operations/customerAPI";

const schema = yup.object({
  customerContactNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number is not valid"),
});

const CutomerBookingDetailsRequestForm = ({ setShowBookings }) => {
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
  });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(fetchSingleCustomerReciepts(data));
    setShowBookings(true);
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] w-full mx-auto my-auto">
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
              inTagName: "customerContactNumber",
              inTagPlaceholder: "Enter Customer Full Name",
            },
          ]}
        />
        <SecondFancyBTN text={"Booking Details"} />
      </form>
    </div>
  );
};

export default CutomerBookingDetailsRequestForm;
