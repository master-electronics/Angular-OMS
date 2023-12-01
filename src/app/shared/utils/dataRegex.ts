export const ToteBarcodeRegex = /^\d{2}-\d{2}-\d{2}$/;
export const ITNBarcodeRegex = /^[a-zA-Z]{2}\d{8}$/;
export const CartBarcodeRegex = /^OS\d{3,4}/;
export const AggregationShelfBarcodeRegex = /^10-AG-\d{2}-\d{2}-[A-Z]-\d{2}$/;
export const ShelfBarcodeBarcodeRegex = /^\w{2}-\w{2}-\d{2}-\d{2}-[A-Z]-\d{2}$/;
export const ShelfBarcodeBarcodeAltRegex =
  /^\w{2}-\w{2}-\d{2}-\d{2}-[A-Z]-\w{2}$/;
export const OrderBarcodeRegex = /^\w{6}-\d{2}$/;
export const dateCodeRegex = /^\d{2}[[0-4]\d$|5[0-4]|]$/;
export const QADropOffRegex = /^QADROP[0-9]{2}$/;
export const DefalutDateCode = /^([0-9][0-9])([0][1-9]|[1-4][0-9]|5[0-3])$/;
