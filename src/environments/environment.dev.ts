export const environment = {
  production: true,
  apiUrl: 'http://10.10.1.88:4000',
  graphql: 'http://10.10.1.88:3000/graphql',
  GTM_ID: 'GTM-KS8744D',
  changelogurl: 'https://rarm18.gitbook.io/wms/changelog',
  DistributionCenter: 'PH',
  // PH DistributionCenter ContainerID
  DC_PH_ID: 1,
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
};
