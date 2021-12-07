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
  Event_QC_Start: 200,
  Event_QC_Hold: 201,
};
