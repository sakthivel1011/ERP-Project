import * as yup from "yup";

export const customerSchema = yup.object().shape({
  customerCode: yup.string().required("Customer Code is required"),
  companyName: yup.string().required("Company Name is required"),
  gstNumber: yup.string().nullable(),
  panNumber: yup.string().nullable(),
  
 
  contacts: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Contact Person Name is required"),
    })
  )
});
