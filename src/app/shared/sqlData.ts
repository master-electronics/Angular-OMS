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
  pickComplete_ID: 10,
  notFound_ID: 15,
  droppedQC_ID: 20,
  warehouseHold_ID: 30,
  salesHold_ID: 40,
  qcComplete_ID: 60,
  agInComplete_ID: 63,
  agOutComplete_ID: 65,
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
  Event_Pulling_Start: 400,
  Event_Pulling_SelectCart: 401,
  Event_Pulling_PullITN: 402,
  Event_Pulling_SelectLocation: 403,
  Event_Pulling_NotFound: 404,
  Event_DropOff_Start: 500,
  Event_DropOff_SelectITN: 501,
  Event_DropOff_Done: 502,
  Event_DropOff_SelectCart: 503,
  Event_Release_Done: 600,
  // stocking
  Event_Stocking_ScanLocation: 710,
  Event_Stocking_ScanITN: 711,
  Event_Stocking_StockingRelocation_Start: 720,
  Event_Stocking_StockingRelocation_Location: 721,
  Event_Stocking_StockingReLocation_Done: 722,
  Event_Stocking_StockingMismatch_Start: 730,
  Event_Stocking_Stocking_verifyITN: 733,
  Event_Stocking_StockingMismatch_Done: 731,
  Event_Stocking_Stocking_MoveITNToUser: 732,
  Event_Stocking_NotFound: 734,
  // sorting
  Event_Stocking_SortingStart: 900,
  Event_Stocking_SortingDone: 901,
};
