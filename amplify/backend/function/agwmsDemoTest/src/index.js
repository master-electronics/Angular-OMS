let postgres = require('postgres');
let { RDS_URL, RDS_PORT, RDS_USER, RDS_PASSWORD, RDS_DATABASE } = process.env;

exports.handler = async (event) => {
  let connectionConfig = {
    host: RDS_URL,
    port: RDS_PORT,
    username: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  };

  let sql = postgres(connectionConfig);

  if (event.info.parentTypeName === 'Mutation') {
    let newCar = event.arguments.input;
    newCar.id = `CAR${Date.now()}${Math.random().toString(16).slice(2)}`;
    let [car] = await sql`INSERT INTO Car ${sql(newCar)} RETURNING ${sql(Object.keys(newCar))}`;
    return car;
  }

  let payload = {};

  let parkingColumns = event.info.selectionSetList.filter((item) => !item.startsWith('car'));
  let [parking] = await sql`SELECT ${sql(parkingColumns)} FROM Parking WHERE id = ${
    event.arguments.id
  }`;

  payload = { ...parking };

  if (event.info.selectionSetList.some((item) => item === 'car')) {
    let carColumns = event.info.selectionSetList
      .filter((item) => item.startsWith('car/') && !item.includes('parking'))
      .map((item) => item.split('/')[1]);
    let [car] = await sql`SELECT ${sql(carColumns)} FROM Car WHERE parking_id = ${parking.id}`;

    payload.car = { ...car };
  }

  if (event.info.selectionSetList.some((item) => item === 'car/parking')) {
    let carParkingColumns = event.info.selectionSetList
      .filter((item) => item.startsWith('car/parking/'))
      .map((item) => item.split('/')[2]);

    if (carParkingColumns.every((col) => parking[col])) {
      payload.car.parking = {};
      carParkingColumns.forEach((col) => {
        payload.car.parking[col] = parking[col];
      });
    } else {
      let parkingExtraColumns = carParkingColumns.filter((item) => !parkingColumns.includes(item));
      let [parkingExtraFields] = await sql`SELECT ${sql(
        parkingExtraColumns
      )} FROM Parking WHERE id = ${event.arguments.id}`;
      payload.car.parking = { ...parking, ...parkingExtraFields };
    }
  }

  await sql.end({ timeout: 0 });

  return payload;
};
