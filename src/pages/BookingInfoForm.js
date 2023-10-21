// importing from packages
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

// importing components
import TextInputField from "../components/core/VenueForm/TextInputField";
import SecondFancyBTN from "../components/common/SecondFancyBTN";
import {
  checkForConflict,
  convertHour24HourToAMPM,
  localToUnixTimestamp,
} from "../utils/utilities";

// API call related imports
import { createNewBooking } from "../services/operations/bookingsAPI";

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
  console.log({ token });
  const { venue } = useSelector((state) => state.venue);
  const { user } = useSelector((state) => state.user);
  const { checkIn, checkOut } = useSelector((state) => state.newBooking);
  const { venueBookingsGivenMonth } = useSelector((state) => state.newBooking);

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
      checkInTime: `${convertHour24HourToAMPM(checkIn.time)} on ${
        checkIn.date
      }`,
      checkOutTime: `${convertHour24HourToAMPM(checkOut.time)} on ${
        checkOut.date
      }`,
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("customerName", data.customerName);
    formData.append("customerContactNumber", data.customerContactNumber);
    formData.append("totalAmount", data.totalAmount);
    formData.append("advancePaid", data.advancePaid);
    const [di, mi, yi] = checkIn.date.split("/");
    const checkInTime = localToUnixTimestamp(yi, mi, di, checkIn.time);
    formData.append("checkInTime", checkInTime);
    const [doo, mo, yo] = checkOut.date.split("/");
    const checkOutTime = localToUnixTimestamp(yo, mo, doo, checkOut.time);
    formData.append("checkOutTime", checkOutTime);

    formData.append("venueName", venue.name);
    formData.append("venueAddress", `${venue.street}, ${venue.landmark}`);
    formData.append("managerContactNumber", user.contactNumber);
    formData.append("venueId", venue._id);

    formData.append("nextPaymentDueDate", checkInTime - 30 * 86400);
    const advancePaidOn = Math.floor(Date.now() / 1000);
    formData.append("advancePaidOn", advancePaidOn);

    dispatch(createNewBooking(formData, navigate, token));
    // for (const entry of formData.entries()) {
    //   const [key, value] = entry;
    //   console.log(`${key} : ${value}`);
    // }
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
