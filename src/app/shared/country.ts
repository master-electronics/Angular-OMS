const country = [
  {
    CountryName: '',
    ISO2: 'UNKNOW',
    ISO3: 'UNKNOW',
  },
  {
    CountryName: 'UNITED STATES',
    ISO2: 'US',
    ISO3: 'USA',
  },
  {
    CountryName: 'CANADA',
    ISO2: 'CA',
    ISO3: 'CAN',
  },
  {
    CountryName: 'BENIN',
    ISO2: 'BJ',
    ISO3: 'BEN',
  },
  {
    CountryName: 'ANGUILLA',
    ISO2: 'AI',
    ISO3: 'AIA',
  },
  {
    CountryName: 'ANTIGUA AND BARBUDA',
    ISO2: 'AG',
    ISO3: 'ATG',
  },
  {
    CountryName: 'PUERTO RICO',
    ISO2: 'PR',
    ISO3: 'PRI',
  },
  {
    CountryName: 'SAINT KITTS AND NEVIS',
    ISO2: 'KN',
    ISO3: 'KNA',
  },
  {
    CountryName: 'TRINIDAD AND TOBAGO',
    ISO2: 'TT',
    ISO3: 'TTO',
  },
  {
    CountryName: 'TURKS & CAICOS',
    ISO2: 'TC',
    ISO3: 'TCA',
  },
  {
    CountryName: 'SAINT LUCIA',
    ISO2: 'LC',
    ISO3: 'LCA',
  },
  {
    CountryName: 'ST. VINCENT & GRENADINES',
    ISO2: 'VC',
    ISO3: 'VCT',
  },
  {
    CountryName: 'BAHAMAS',
    ISO2: 'BS',
    ISO3: 'BHS',
  },
  {
    CountryName: 'BERMUDA',
    ISO2: 'BM',
    ISO3: 'BMU',
  },
  {
    CountryName: 'CAYMAN ISLANDS',
    ISO2: 'KY',
    ISO3: 'CYM',
  },
  {
    CountryName: 'VIRGIN ISLANDS, BRITISH',
    ISO2: 'VG',
    ISO3: 'VGB',
  },
  {
    CountryName: 'DOMINICA',
    ISO2: 'DM',
    ISO3: 'DMA',
  },
  {
    CountryName: 'VIRGIN ISLANDS, U.S.',
    ISO2: 'VI',
    ISO3: 'VIR',
  },
  {
    CountryName: 'ALAND ISLANDS',
    ISO2: 'AX',
    ISO3: 'ALA',
  },
  {
    CountryName: 'BOUVET ISLAND',
    ISO2: 'BV',
    ISO3: 'BVT',
  },
  {
    CountryName: 'BRITISH INDIAN OCEAN TERR',
    ISO2: 'IO',
    ISO3: 'IOT',
  },
  {
    CountryName: 'FRENCH SOUTHERN TERR',
    ISO2: 'TF',
    ISO3: 'ATF',
  },
  {
    CountryName: 'GUERNSEY',
    ISO2: 'GG',
    ISO3: 'GGY',
  },
  {
    CountryName: 'HEARD/MCDONALD ISLANDS',
    ISO2: 'HM',
    ISO3: 'HMD',
  },
  {
    CountryName: 'HOLY SEE (VATICAN CITY)',
    ISO2: 'VA',
    ISO3: 'VAT',
  },
  {
    CountryName: 'ISLE OF MAN',
    ISO2: 'IM',
    ISO3: 'IMN',
  },
  {
    CountryName: 'JERSEY',
    ISO2: 'JE',
    ISO3: 'JEY',
  },
  {
    CountryName: 'DOMINICAN REPUBLIC',
    ISO2: 'DO',
    ISO3: 'DOM',
  },
  {
    CountryName: 'NIUE',
    ISO2: 'NU',
    ISO3: 'NIU',
  },
  {
    CountryName: 'NORFOLK ISLAND',
    ISO2: 'NF',
    ISO3: 'NFK',
  },
  {
    CountryName: 'NORTHERN MARIANA ISLANDS',
    ISO2: 'MP',
    ISO3: 'MNP',
  },
  {
    CountryName: 'PALAU',
    ISO2: 'PW',
    ISO3: 'PLW',
  },
  {
    CountryName: 'PALESTINIAN TERRITORY',
    ISO2: 'PS',
    ISO3: 'PSE',
  },
  {
    CountryName: 'REUNION',
    ISO2: 'RE',
    ISO3: 'REU',
  },
  {
    CountryName: 'SAINT BARTHELEMY',
    ISO2: 'BL',
    ISO3: 'BLM',
  },
  {
    CountryName: 'SAINT MARTIN',
    ISO2: 'MF',
    ISO3: 'MAF',
  },
  {
    CountryName: 'SAINT PIERRE AND MIQUELON',
    ISO2: 'PM',
    ISO3: 'SPM',
  },
  {
    CountryName: 'SAO TOME AND PRINCIPE',
    ISO2: 'ST',
    ISO3: 'STP',
  },
  {
    CountryName: 'S.GEORGIA&S.SANDWICH IS.',
    ISO2: 'GS',
    ISO3: 'SGS',
  },
  {
    CountryName: 'SVALBARD AND JAN MAYEN',
    ISO2: 'SJ',
    ISO3: 'SJM',
  },
  {
    CountryName: 'TIMOR-LESTE',
    ISO2: 'TL',
    ISO3: 'TLS',
  },
  {
    CountryName: 'TOKELAU',
    ISO2: 'TK',
    ISO3: 'TKL',
  },
  {
    CountryName: 'WALLIS AND FUTUNIA',
    ISO2: 'WF',
    ISO3: 'WLF',
  },
  {
    CountryName: 'WESTERN SAHARA',
    ISO2: 'EH',
    ISO3: 'ESH',
  },
  {
    CountryName: 'U.S. MINOR OUTLYING IS.',
    ISO2: 'UM',
    ISO3: 'UMI',
  },
  {
    CountryName: 'JAMAICA',
    ISO2: 'JM',
    ISO3: 'JAM',
  },
  {
    CountryName: 'MONTSERRAT',
    ISO2: 'MS',
    ISO3: 'MSR',
  },
  {
    CountryName: 'EGYPT',
    ISO2: 'EG',
    ISO3: 'EGY',
  },
  {
    CountryName: 'MOROCCO',
    ISO2: 'MA',
    ISO3: 'MAR',
  },
  {
    CountryName: 'ALGERIA',
    ISO2: 'DZ',
    ISO3: 'DZA',
  },
  {
    CountryName: 'TUNISIA',
    ISO2: 'TN',
    ISO3: 'TUN',
  },
  {
    CountryName: 'LIBYAN ARAB JAMAHIRIYA',
    ISO2: 'LY',
    ISO3: 'LBY',
  },
  {
    CountryName: 'GAMBIA',
    ISO2: 'GM',
    ISO3: 'GMB',
  },
  {
    CountryName: 'SENEGAL',
    ISO2: 'SN',
    ISO3: 'SEN',
  },
  {
    CountryName: 'MAURITANIA',
    ISO2: 'MR',
    ISO3: 'MRT',
  },
  {
    CountryName: 'MALI',
    ISO2: 'ML',
    ISO3: 'MLI',
  },
  {
    CountryName: 'GUINEA',
    ISO2: 'GN',
    ISO3: 'GIN',
  },
  {
    CountryName: "COTE D'IVOIRE",
    ISO2: 'CI',
    ISO3: 'CIV',
  },
  {
    CountryName: 'BUKINA FASO',
    ISO2: 'BF',
    ISO3: 'BFA',
  },
  {
    CountryName: 'NIGER',
    ISO2: 'NE',
    ISO3: 'NER',
  },
  {
    CountryName: 'TOGO',
    ISO2: 'TG',
    ISO3: 'TGO',
  },
  {
    CountryName: 'MAURITIUS',
    ISO2: 'MU',
    ISO3: 'MUS',
  },
  {
    CountryName: 'LIBERIA',
    ISO2: 'LR',
    ISO3: 'LBR',
  },
  {
    CountryName: 'SIERRA LEONE',
    ISO2: 'SL',
    ISO3: 'SLE',
  },
  {
    CountryName: 'GHANA',
    ISO2: 'GH',
    ISO3: 'GHA',
  },
  {
    CountryName: 'NIGERIA',
    ISO2: 'NG',
    ISO3: 'NGA',
  },
  {
    CountryName: 'CHAD',
    ISO2: 'TD',
    ISO3: 'TCD',
  },
  {
    CountryName: 'CENTRAL AFRICAN REPUBLIC',
    ISO2: 'CF',
    ISO3: 'CAF',
  },
  {
    CountryName: 'CAMEROON',
    ISO2: 'CM',
    ISO3: 'CMR',
  },
  {
    CountryName: 'CAPE VERDE ISLANDS',
    ISO2: 'CV',
    ISO3: 'CPV',
  },
  {
    CountryName: 'EQUATORIAL GUINEA',
    ISO2: 'GQ',
    ISO3: 'GNQ',
  },
  {
    CountryName: 'GABON',
    ISO2: 'GA',
    ISO3: 'GAB',
  },
  {
    CountryName: 'CONGO',
    ISO2: 'CG',
    ISO3: 'COG',
  },
  {
    CountryName: 'CONGO, DEM REP OF',
    ISO2: 'CD',
    ISO3: 'COD',
  },
  {
    CountryName: 'ANGOLA',
    ISO2: 'AO',
    ISO3: 'AGO',
  },
  {
    CountryName: 'GUINEA-BISSAU',
    ISO2: 'GW',
    ISO3: 'GNB',
  },
  {
    CountryName: 'SEYCHELLES',
    ISO2: 'SC',
    ISO3: 'SYC',
  },
  {
    CountryName: 'SUDAN',
    ISO2: 'SD',
    ISO3: 'SDN',
  },
  {
    CountryName: 'RWANDA',
    ISO2: 'RW',
    ISO3: 'RWA',
  },
  {
    CountryName: 'ETHIOPIA',
    ISO2: 'ET',
    ISO3: 'ETH',
  },
  {
    CountryName: 'SOMALIA',
    ISO2: 'SO',
    ISO3: 'SOM',
  },
  {
    CountryName: 'DJIBOUTI',
    ISO2: 'DJ',
    ISO3: 'DJI',
  },
  {
    CountryName: 'KENYA',
    ISO2: 'KE',
    ISO3: 'KEN',
  },
  {
    CountryName: 'TANZANIA',
    ISO2: 'TZ',
    ISO3: 'TZA',
  },
  {
    CountryName: 'UGANDA',
    ISO2: 'UG',
    ISO3: 'UGA',
  },
  {
    CountryName: 'BURUNDI',
    ISO2: 'BI',
    ISO3: 'BDI',
  },
  {
    CountryName: 'MOZANBIQUE',
    ISO2: 'MZ',
    ISO3: 'MOZ',
  },
  {
    CountryName: 'ZAMBIA',
    ISO2: 'ZM',
    ISO3: 'ZMB',
  },
  {
    CountryName: 'MADAGASCAR',
    ISO2: 'MG',
    ISO3: 'MDG',
  },
  {
    CountryName: 'ZIMBABWE',
    ISO2: 'ZW',
    ISO3: 'ZWE',
  },
  {
    CountryName: 'NAMIBIA',
    ISO2: 'NA',
    ISO3: 'NAM',
  },
  {
    CountryName: 'MALAWI',
    ISO2: 'MW',
    ISO3: 'MWI',
  },
  {
    CountryName: 'LESOTHO',
    ISO2: 'LS',
    ISO3: 'LSO',
  },
  {
    CountryName: 'BOTSWANA',
    ISO2: 'BW',
    ISO3: 'BWA',
  },
  {
    CountryName: 'SWAZILAND',
    ISO2: 'SZ',
    ISO3: 'SWZ',
  },
  {
    CountryName: 'COMOROS',
    ISO2: 'KM',
    ISO3: 'COM',
  },
  {
    CountryName: 'MAYOTTE',
    ISO2: 'YT',
    ISO3: 'MYT',
  },
  {
    CountryName: 'SOUTH AFRICA',
    ISO2: 'ZA',
    ISO3: 'ZAF',
  },
  {
    CountryName: 'SAINT HELENA',
    ISO2: 'SH',
    ISO3: 'SHN',
  },
  {
    CountryName: 'ERITREA',
    ISO2: 'ER',
    ISO3: 'ERI',
  },
  {
    CountryName: 'ARUBA',
    ISO2: 'AW',
    ISO3: 'ABW',
  },
  {
    CountryName: 'FAROE ISLANDS',
    ISO2: 'FO',
    ISO3: 'FRO',
  },
  {
    CountryName: 'GREENLAND',
    ISO2: 'GL',
    ISO3: 'GRL',
  },
  {
    CountryName: 'GREECE',
    ISO2: 'GR',
    ISO3: 'GRC',
  },
  {
    CountryName: 'NETHERLANDS',
    ISO2: 'NL',
    ISO3: 'NLD',
  },
  {
    CountryName: 'BELGIUM',
    ISO2: 'BE',
    ISO3: 'BEL',
  },
  {
    CountryName: 'FRANCE',
    ISO2: 'FR',
    ISO3: 'FRA',
  },
  {
    CountryName: 'MONACO',
    ISO2: 'MC',
    ISO3: 'MCO',
  },
  {
    CountryName: 'SPAIN',
    ISO2: 'ES',
    ISO3: 'ESP',
  },
  {
    CountryName: 'GIBRALTAR',
    ISO2: 'GI',
    ISO3: 'GIB',
  },
  {
    CountryName: 'LUXEMBOURG',
    ISO2: 'LU',
    ISO3: 'LUX',
  },
  {
    CountryName: 'IRELAND',
    ISO2: 'IE',
    ISO3: 'IRL',
  },
  {
    CountryName: 'ICELAND',
    ISO2: 'IS',
    ISO3: 'ISL',
  },
  {
    CountryName: 'ALBANIA',
    ISO2: 'AL',
    ISO3: 'ALB',
  },
  {
    CountryName: 'MALTA',
    ISO2: 'MT',
    ISO3: 'MLT',
  },
  {
    CountryName: 'CYPRUS',
    ISO2: 'CY',
    ISO3: 'CYP',
  },
  {
    CountryName: 'FINLAND',
    ISO2: 'FI',
    ISO3: 'FIN',
  },
  {
    CountryName: 'BULGARIA',
    ISO2: 'BG',
    ISO3: 'BGR',
  },
  {
    CountryName: 'HUNGARY',
    ISO2: 'HU',
    ISO3: 'HUN',
  },
  {
    CountryName: 'PORTUGAL',
    ISO2: 'PT',
    ISO3: 'PRT',
  },
  {
    CountryName: 'LITHUANIA',
    ISO2: 'LT',
    ISO3: 'LTU',
  },
  {
    CountryName: 'LATVIA',
    ISO2: 'LV',
    ISO3: 'LVA',
  },
  {
    CountryName: 'ESTONIA',
    ISO2: 'EE',
    ISO3: 'EST',
  },
  {
    CountryName: 'REPUBLIC OF MOLDOVA',
    ISO2: 'MD',
    ISO3: 'MDA',
  },
  {
    CountryName: 'ARMENIA',
    ISO2: 'AM',
    ISO3: 'ARM',
  },
  {
    CountryName: 'BELARUS',
    ISO2: 'BY',
    ISO3: 'BLR',
  },
  {
    CountryName: 'ANDORRA',
    ISO2: 'AD',
    ISO3: 'AND',
  },
  {
    CountryName: 'SAN MARINO',
    ISO2: 'SM',
    ISO3: 'SMR',
  },
  {
    CountryName: 'UKRAINE',
    ISO2: 'UA',
    ISO3: 'UKR',
  },
  {
    CountryName: 'SERBIA',
    ISO2: 'RS',
    ISO3: 'SRB',
  },
  {
    CountryName: 'MONTENEGRO',
    ISO2: 'ME',
    ISO3: 'MNE',
  },
  {
    CountryName: 'CROATIA',
    ISO2: 'HR',
    ISO3: 'HRV',
  },
  {
    CountryName: 'SLOVENIA',
    ISO2: 'SI',
    ISO3: 'SVN',
  },
  {
    CountryName: 'BOSNIA HERZEGOVINA',
    ISO2: 'BA',
    ISO3: 'BIH',
  },
  {
    CountryName: 'MACEDONIA',
    ISO2: 'MK',
    ISO3: 'MKD',
  },
  {
    CountryName: 'ITALY',
    ISO2: 'IT',
    ISO3: 'ITA',
  },
  {
    CountryName: 'ROMANIA',
    ISO2: 'RO',
    ISO3: 'ROM',
  },
  {
    CountryName: 'SWITZERLAND',
    ISO2: 'CH',
    ISO3: 'CHE',
  },
  {
    CountryName: 'LIECHTENSTEIN',
    ISO2: 'LI',
    ISO3: 'LIE',
  },
  {
    CountryName: 'CZECH REPUBLIC',
    ISO2: 'CZ',
    ISO3: 'CZE',
  },
  {
    CountryName: 'SLOVAKIA',
    ISO2: 'SK',
    ISO3: 'SVK',
  },
  {
    CountryName: 'AUSTRIA',
    ISO2: 'AT',
    ISO3: 'AUT',
  },
  {
    CountryName: 'DENMARK',
    ISO2: 'DK',
    ISO3: 'DNK',
  },
  {
    CountryName: 'SWEDEN',
    ISO2: 'SE',
    ISO3: 'SWE',
  },
  {
    CountryName: 'NORWAY',
    ISO2: 'NO',
    ISO3: 'NOR',
  },
  {
    CountryName: 'GRENADA',
    ISO2: 'GD',
    ISO3: 'GRD',
  },
  {
    CountryName: 'POLAND',
    ISO2: 'PL',
    ISO3: 'POL',
  },
  {
    CountryName: 'GERMANY',
    ISO2: 'DE',
    ISO3: 'DEU',
  },
  {
    CountryName: 'FALKLAND ISLANDS',
    ISO2: 'FK',
    ISO3: 'FLK',
  },
  {
    CountryName: 'BELIZE',
    ISO2: 'BZ',
    ISO3: 'BLZ',
  },
  {
    CountryName: 'GUATEMALA',
    ISO2: 'GT',
    ISO3: 'GTM',
  },
  {
    CountryName: 'EL SALVADOR',
    ISO2: 'SV',
    ISO3: 'SLV',
  },
  {
    CountryName: 'HONDURAS',
    ISO2: 'HN',
    ISO3: 'HND',
  },
  {
    CountryName: 'NICARAGUA',
    ISO2: 'NI',
    ISO3: 'NIC',
  },
  {
    CountryName: 'COSTA RICA',
    ISO2: 'CR',
    ISO3: 'CRI',
  },
  {
    CountryName: 'PANAMA',
    ISO2: 'PA',
    ISO3: 'PAN',
  },
  {
    CountryName: 'HAITI',
    ISO2: 'HT',
    ISO3: 'HTI',
  },
  {
    CountryName: 'PERU',
    ISO2: 'PE',
    ISO3: 'PER',
  },
  {
    CountryName: 'MEXICO',
    ISO2: 'MX',
    ISO3: 'MEX',
  },
  {
    CountryName: 'CUBA',
    ISO2: 'CU',
    ISO3: 'CUB',
  },
  {
    CountryName: 'ARGENTINA',
    ISO2: 'AR',
    ISO3: 'ARG',
  },
  {
    CountryName: 'BRAZIL',
    ISO2: 'BR',
    ISO3: 'BRA',
  },
  {
    CountryName: 'CHILE',
    ISO2: 'CL',
    ISO3: 'CHL',
  },
  {
    CountryName: 'COLOMBIA',
    ISO2: 'CO',
    ISO3: 'COL',
  },
  {
    CountryName: 'VENEZUELA',
    ISO2: 'VE',
    ISO3: 'VEN',
  },
  {
    CountryName: 'GUADELOUPE',
    ISO2: 'GP',
    ISO3: 'GLP',
  },
  {
    CountryName: 'BOLIVIA',
    ISO2: 'BO',
    ISO3: 'BOL',
  },
  {
    CountryName: 'GUYANA',
    ISO2: 'GY',
    ISO3: 'GUY',
  },
  {
    CountryName: 'ECUADOR',
    ISO2: 'EC',
    ISO3: 'ECU',
  },
  {
    CountryName: 'FRENCH GUIANA',
    ISO2: 'GF',
    ISO3: 'GUF',
  },
  {
    CountryName: 'PARAGUAY',
    ISO2: 'PY',
    ISO3: 'PRY',
  },
  {
    CountryName: 'MARTINIQUE',
    ISO2: 'MQ',
    ISO3: 'MTQ',
  },
  {
    CountryName: 'SURINAME',
    ISO2: 'SR',
    ISO3: 'SUR',
  },
  {
    CountryName: 'URUGUAY',
    ISO2: 'UY',
    ISO3: 'URY',
  },
  {
    CountryName: 'NETHERLANDS ANTILLES',
    ISO2: 'AN',
    ISO3: 'ANT',
  },
  {
    CountryName: 'CURACAO',
    ISO2: 'CW',
    ISO3: 'CUW',
  },
  {
    CountryName: 'MALAYSIA',
    ISO2: 'MY',
    ISO3: 'MYS',
  },
  {
    CountryName: 'AUSTRALIA',
    ISO2: 'AU',
    ISO3: 'AUS',
  },
  {
    CountryName: 'INDONESIA',
    ISO2: 'ID',
    ISO3: 'IDN',
  },
  {
    CountryName: 'PHILIPPINES',
    ISO2: 'PH',
    ISO3: 'PHL',
  },
  {
    CountryName: 'NEW ZEALAND',
    ISO2: 'NZ',
    ISO3: 'NZL',
  },
  {
    CountryName: 'PITCAIN ISLAND',
    ISO2: 'PN',
    ISO3: 'PCN',
  },
  {
    CountryName: 'SINGAPORE',
    ISO2: 'SG',
    ISO3: 'SGP',
  },
  {
    CountryName: 'THAILAND',
    ISO2: 'TH',
    ISO3: 'THA',
  },
  {
    CountryName: 'GUAM',
    ISO2: 'GU',
    ISO3: 'GUM',
  },
  {
    CountryName: 'ANTARCTIC AUS TERRITORY',
    ISO2: 'AQ',
    ISO3: 'ATA',
  },
  {
    CountryName: 'CHRISTMAS ISLAND',
    ISO2: 'CX',
    ISO3: 'CXR',
  },
  {
    CountryName: 'COCOS ISLAND',
    ISO2: 'CC',
    ISO3: 'CCK',
  },
  {
    CountryName: 'BRUNEI DARUSSALAM',
    ISO2: 'BN',
    ISO3: 'BRN',
  },
  {
    CountryName: 'NAURU',
    ISO2: 'NR',
    ISO3: 'NRU',
  },
  {
    CountryName: 'PAPUA NEW GUINEA',
    ISO2: 'PG',
    ISO3: 'PNG',
  },
  {
    CountryName: 'TONGO',
    ISO2: 'TO',
    ISO3: 'TON',
  },
  {
    CountryName: 'SOLOM ISLANDS',
    ISO2: 'SB',
    ISO3: 'SLB',
  },
  {
    CountryName: 'VANUATU',
    ISO2: 'VU',
    ISO3: 'VUT',
  },
  {
    CountryName: 'FIJI',
    ISO2: 'FJ',
    ISO3: 'FJI',
  },
  {
    CountryName: 'COOK ISLANDS',
    ISO2: 'CK',
    ISO3: 'COK',
  },
  {
    CountryName: 'AMERICAN SAMOA',
    ISO2: 'AS',
    ISO3: 'ASM',
  },
  {
    CountryName: 'SAMOA',
    ISO2: 'WS',
    ISO3: 'WSM',
  },
  {
    CountryName: 'KIRIBATI',
    ISO2: 'KI',
    ISO3: 'KIR',
  },
  {
    CountryName: 'NEW CALEDONIA',
    ISO2: 'NC',
    ISO3: 'NCL',
  },
  {
    CountryName: 'TUVALU',
    ISO2: 'TV',
    ISO3: 'TUV',
  },
  {
    CountryName: 'FRENCH POLYNESIA',
    ISO2: 'PF',
    ISO3: 'PYF',
  },
  {
    CountryName: 'MICRONESIA',
    ISO2: 'FM',
    ISO3: 'FSM',
  },
  {
    CountryName: 'MARSHALL ISLANDS',
    ISO2: 'MH',
    ISO3: 'MHL',
  },
  {
    CountryName: 'KAZAKHSTAN',
    ISO2: 'KZ',
    ISO3: 'KAZ',
  },
  {
    CountryName: 'KYRGYZSTAN',
    ISO2: 'KG',
    ISO3: 'KGZ',
  },
  {
    CountryName: 'RUSSIA',
    ISO2: 'RU',
    ISO3: 'RUS',
  },
  {
    CountryName: 'TAJIKISTAN',
    ISO2: 'TJ',
    ISO3: 'TJK',
  },
  {
    CountryName: 'TURKMENISTAN',
    ISO2: 'TM',
    ISO3: 'TKM',
  },
  {
    CountryName: 'UZBEKISTAN',
    ISO2: 'UZ',
    ISO3: 'UZB',
  },
  {
    CountryName: 'BARBADOS',
    ISO2: 'BB',
    ISO3: 'BRB',
  },
  {
    CountryName: 'JAPAN',
    ISO2: 'JP',
    ISO3: 'JPN',
  },
  {
    CountryName: 'KOREA, REPUBLIC OF',
    ISO2: 'KR',
    ISO3: 'KOR',
  },
  {
    CountryName: 'UNITED KINGDOM',
    ISO2: 'GB',
    ISO3: 'GBR',
  },
  {
    CountryName: 'VIETNAM',
    ISO2: 'VN',
    ISO3: 'VNM',
  },
  {
    CountryName: 'KOREA (NORTH)',
    ISO2: 'KP',
    ISO3: 'PRK',
  },
  {
    CountryName: 'HONG KONG',
    ISO2: 'HK',
    ISO3: 'HKG',
  },
  {
    CountryName: 'MACAO',
    ISO2: 'MO',
    ISO3: 'MAC',
  },
  {
    CountryName: 'CAMBODIA',
    ISO2: 'KH',
    ISO3: 'KHM',
  },
  {
    CountryName: 'LAOS',
    ISO2: 'LA',
    ISO3: 'LAO',
  },
  {
    CountryName: 'CHINA',
    ISO2: 'CN',
    ISO3: 'CHN',
  },
  {
    CountryName: 'TAIWAN',
    ISO2: 'TW',
    ISO3: 'TWN',
  },
  {
    CountryName: 'BANGLADESH',
    ISO2: 'BD',
    ISO3: 'BGD',
  },
  {
    CountryName: 'TURKEY',
    ISO2: 'TR',
    ISO3: 'TUR',
  },
  {
    CountryName: 'INDIA',
    ISO2: 'IN',
    ISO3: 'IND',
  },
  {
    CountryName: 'PAKISTAN',
    ISO2: 'PK',
    ISO3: 'PAK',
  },
  {
    CountryName: 'AFGHANISTAN',
    ISO2: 'AF',
    ISO3: 'AFG',
  },
  {
    CountryName: 'SRI LANKA',
    ISO2: 'LK',
    ISO3: 'LKA',
  },
  {
    CountryName: 'MYANMAR(BURMA)',
    ISO2: 'MM',
    ISO3: 'MMR',
  },
  {
    CountryName: 'MALDIVES',
    ISO2: 'MV',
    ISO3: 'MDV',
  },
  {
    CountryName: 'LEBANON',
    ISO2: 'LB',
    ISO3: 'LBN',
  },
  {
    CountryName: 'JORDAN',
    ISO2: 'JO',
    ISO3: 'JOR',
  },
  {
    CountryName: 'SYRIA',
    ISO2: 'SY',
    ISO3: 'SYR',
  },
  {
    CountryName: 'IRAQ',
    ISO2: 'IQ',
    ISO3: 'IRQ',
  },
  {
    CountryName: 'KUWAIT',
    ISO2: 'KW',
    ISO3: 'KWT',
  },
  {
    CountryName: 'SAUDI ARABIA',
    ISO2: 'SA',
    ISO3: 'SAU',
  },
  {
    CountryName: 'YEMEN',
    ISO2: 'YE',
    ISO3: 'YEM',
  },
  {
    CountryName: 'OMAN',
    ISO2: 'OM',
    ISO3: 'OMN',
  },
  {
    CountryName: 'UNITED ARAB EMIRATES',
    ISO2: 'AE',
    ISO3: 'ARE',
  },
  {
    CountryName: 'ISRAEL',
    ISO2: 'IL',
    ISO3: 'ISR',
  },
  {
    CountryName: 'BAHRAIN',
    ISO2: 'BH',
    ISO3: 'BHR',
  },
  {
    CountryName: 'QATAR',
    ISO2: 'QA',
    ISO3: 'QAT',
  },
  {
    CountryName: 'BHUTAN',
    ISO2: 'BT',
    ISO3: 'BTN',
  },
  {
    CountryName: 'MONGOLIA',
    ISO2: 'MN',
    ISO3: 'MNG',
  },
  {
    CountryName: 'NEPAL',
    ISO2: 'NP',
    ISO3: 'NPL',
  },
  {
    CountryName: 'IRAN',
    ISO2: 'IR',
    ISO3: 'IRN',
  },
  {
    CountryName: 'AZERBAIJAN',
    ISO2: 'AZ',
    ISO3: 'AZE',
  },
  {
    CountryName: 'GEORGIA',
    ISO2: 'GE',
    ISO3: 'GEO',
  },
  {
    CountryName: 'EUROPEAN UNION',
    ISO2: 'EU',
    ISO3: 'EUR',
  },
  {
    CountryName: 'MOLDOVA',
    ISO2: 'MD',
    ISO3: 'MDA',
  },
];

export default country;
