import * as yup from "yup";

export const salesOrderSchema = yup.object().shape({
  customerId: yup.string().required("Company Name is required"),
  salesOrderNumber: yup.string().required("Sales Order Number is required"),
  customerPoNumber: yup.string().required("Customer PO Number is required"),
  salesOrderDate: yup.string().required("Sales Order Date is required"),
  expectedDeliveryDate: yup.string().required("Expected Delivery Date is required"),
  items: yup.array().of(
    yup.object().shape({
      itemDescription: yup.string().required("Description is required"),
      qty: yup.number().typeError("Must be a number").positive("Must be > 0").required("Required"),
      rate: yup.number().typeError("Must be a number").positive("Must be > 0").required("Required"),
    })
  )
});
