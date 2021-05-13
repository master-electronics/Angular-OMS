import Country from './src/app/shared/country.mjs';

Country.map((ele, index) => {
  const output = `{_id:${index + 1}, name:'${ele.ISO2}: ${ele.CountryName}'},`;
  console.log(output);
});
