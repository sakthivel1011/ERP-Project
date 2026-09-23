import * as Yup from "yup";

export const goodsReceiptNoteSchema = Yup.object().shape({

  grnNumber: Yup.string().required("GRN Number is required"),
  grnDate: Yup.string().required("Date is required"),
  purchaseOrderNumber: Yup.string().required("Select a PO Number"),
  warehouseName: Yup.string().required("Select a Warehouse"),
  receivedBy: Yup.string().required("Receiver Name is required"),


  vendorName: Yup.string().required("Vendor Name is required"),
  vehicleNumber: Yup.string().required("Vehicle Number is required"),
  transporterName: Yup.string().required("Transporter Name is required"),
  driverName: Yup.string().required("Driver Name is required"),
  driverMobile: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\d{10}$/, "Must be exactly 10 digits"), 

  
  items: Yup.array().of(
    Yup.object().shape({
      itemCode: Yup.string().required("Item Code is required"),
      description: Yup.string().required("Description is required"),
      orderedQty: Yup.number().typeError("Must be a number").required(),
      receivedQty: Yup.number().typeError("Must be a number").required(),
      acceptedQty: Yup.number()
        .typeError("Must be a number")
        .required()
        
        .test("max-check", "Cannot exceed Received Qty", function (value) {
          return value <= this.parent.receivedQty;
        }),
      rejectedQty: Yup.number().typeError("Must be a number"),
      inspectionStatus: Yup.string().required("Select Inspection Status"),
      remarks: Yup.string().nullable(),
    })
  ),
});
