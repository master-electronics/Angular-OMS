export const sqlData = {
  // PH DistributionCenter ContainerID
  DC_PH_ID: 1,
  //ContainerTypeID
  Container_DC: 1,
  Container_Shelf: 2,
  Container_Tote: 3,
  Container_Pallet: 4,
  Container_Cart: 5,
  Container_PalletRack: 6,
  Container_Overflow: 7,
  Container_Drop: 8,
  Container_User: 9,
  //WMS Status table
  inPickQueue: 0,
  pickComplete_ID: 10,
  notFound_ID: 15,
  droppedQC_ID: 20,
  warehouseHold_ID: 30,
  salesHold_ID: 40,
  qcComplete_ID: 60,
  agInComplete_ID: 63,
  agOutComplete_ID: 65,
  // Suspect Reason
  SuspectReason_Location: 1,
  SuspectReason_Quantity: 2,
  SuspectReason_ROHS: 3,
  SuspectReason_DateCode: 4,
  SuspectReason_CountryOfOrigin: 5,
  SuspectReason_InReceiving: 6,
  //WMS ContainerType table
  shelfType_ID: 2,
  toteType_ID: 3,
  userType_ID: 9,
  // User Event ID
  Event_AgIn_Start: 1,
  Event_AgIn_SingleITNAgOut: 2,
  Event_AgIn_Relocate: 3,
  Event_AgIn_OrderComplete: 4,
  Event_AgIn_Done: 5,
  Event_AgOut_Start: 100,
  Event_AgOut_Done: 101,
  Event_QC_Start: 200,
  Event_QC_Hold: 201,
  Event_QC_Done: 202,
  Event_QC_OrderComplete: 203,
  // pulling
  Event_Pulling_Start: 400,
  Event_Pulling_SelectCart: 401,
  Event_Pulling_PullITN: 402,
  Event_Pulling_SelectLocation: 403,
  Event_Pulling_NotFound: 404,
  // drop off
  Event_DropOff_Start: 500,
  Event_DropOff_ITN_Drop: 501,
  Event_DropOff_Done: 502,
  Event_DropOff_SelectCart: 503,
  Event_DropOff_ITN_Skipped: 504,
  Event_DropOff_Selectlocation: 505,
  // release
  Event_Release_Order: 600,
  // stocking
  Event_Stocking_ScanLocation: 710,
  Event_Stocking_ScanITN: 711,
  Event_Stocking_StockingRelocation_Start: 720,
  Event_Stocking_StockingRelocation_Location: 721,
  Event_Stocking_StockingReLocation_Done: 722,
  Event_Stocking_StockingMismatch_Start: 730,
  Event_Stocking_StockingMismatch_Done: 731,
  Event_Stocking_Stocking_MoveITNToUser: 732,
  Event_Stocking_Stocking_verifyITN: 733,
  Event_Stocking_NotFound: 734,
  // sorting
  Event_Stocking_SortingStart: 900,
  Event_Stocking_SortingDone: 901,
  Event_Stocking_MoveToPersonal: 902,
  //Receipt Entry
  Event_ReceiptEntry_HeaderCreating: 1010,
  Event_ReceiptEntry_HeaderUpdate: 1020,
  Event_ReceiptEntry_HeaderDelete: 1030,
  Event_ReceiptEntry_LineCreating: 1040,
  Event_ReceiptEntry_Lineupdate: 1050,
  Event_ReceiptEntry_LineDelete: 1060,
  Event_ReceiptEntry_LineDetailCreating: 1070,
  Event_ReceiptEntry_LineDetailUpdate: 1080,
  Event_ReceiptEntry_LineDetailDelete: 1090,
  //Receiving
  Event_Receiving_Start: 1100,
  Event_Receiving_create_receipt_start: 1101,
  Event_Receiving_create_receipt_done: 1102,
  Event_Receiving_UpdateInfo: 1120,
  Event_Receiving_GenerateITN: 1130,
  Event_Receiving_UpdateInventory: 1140,
  Event_Receiving_ReceiptLineDone: 1160,
  Event_Receiving_KickOut: 1170,
  Event_Receiving_NotApplicable: 1180,
  Event_Receiving_OverReceiving_done: 1181,
  Event_Receiving_OverReceiving_start: 1182,
  Event_Receiving_OverReceiving_select: 1183,
  // Receipt Status
  Receipt_Entered: 10,
  Receipt_Received: 20,
  Receipt_Confirmed: 30,
  // Autostore
  Event_Autostore_PRODUCT: 3000,
  Event_Autostore_ORDER: 3010,
  Event_Autostore_ASN: 3020,
  Event_Autostore_ASN_ITN_Presented: 3022,
  Event_Autostore_ASN_ITN_Scanned: 3025,
  Event_Autostore_ASN_ITN_Skipped: 3027,
  Event_Autostore_ASN_Location_Scanned: 3030,
  Event_Autostore_ASN_Submitted: 3035,
  ASN_Inventory_Suspect_Reason: 15,
  // Inventory Management
  Event_IM_Audit_Created: 4000,
  Event_IM_System_Audit_Triggered: 4010,
  Event_IM_System_Trigger_Created: 4015,
  Event_IM_System_Trigger_Updated: 4020,
  Event_IM_System_Trigger_AuditType_Added: 4025,
  Event_IM_System_Trigger_AuditTypes_Removed: 4030,
  Event_IM_Audit_Completed: 4090,
  Event_IM_Audit_Closed_ITN_Search: 4095,
  Event_IM_Location_Scanned: 4100,
  Event_IM_ITN_Scanned: 4110,
  Event_IM_Audit_ITN_NF: 4115,
  Event_IM_Quantity_Entered: 4120,
  Event_IM_Quantity_Confirm_Entered: 4121,
  Event_IM_Quantity_Updated: 4125,
  Event_IM_DateCode_Entered: 4130,
  Event_IM_DateCode_Updated: 4135,
  Event_IM_DateCode_NA: 4137,
  Event_IM_COO_Entered: 4140,
  Event_IM_COO_Updated: 4145,
  Event_IM_COO_NA: 4147,
  Event_IM_ROHS_Entered: 4150,
  Event_IM_ROHS_Updated: 4155,
  Event_IM_PartNumber_Entered: 4160,
  Event_IM_PartNumber_Updated: 4165,
  Event_IM_PartNumber_NA: 4167,
  Event_IM_Search_Location_Scanned: 4200,
  Event_IM_Search_ITN_Scanned: 4300,
  Event_IM_Search_ITN_Location_Updated: 4305,
  Event_IM_Search_Audit_Closed_NF: 4310,
};
