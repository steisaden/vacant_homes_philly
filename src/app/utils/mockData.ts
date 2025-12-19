export interface VacantProperty {
  id: string;
  address: string;
  zipCode: string;
  opa_account_num: string;
  vacancy_indicator: 'Likely Vacant' | 'Possibly Vacant' | 'Not Vacant';
  last_inspection: string;
  owner_name: string;
  property_type: string;
  lat: number;
  lng: number;
}

// Legacy mock data simulating ArcGIS FeatureServer response (retained for offline demos).
const mockProperties: VacantProperty[] = [
  // ZIP 19140
  { id: '1', address: '1234 N 5th St', zipCode: '19140', opa_account_num: '882-123-4567', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-11-15', owner_name: 'Smith Holdings LLC', property_type: 'Residential', lat: 40.0150, lng: -75.1350 },
  { id: '2', address: '5678 W Luzerne St', zipCode: '19140', opa_account_num: '882-234-5678', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-10-22', owner_name: 'City of Philadelphia', property_type: 'Residential', lat: 40.0160, lng: -75.1360 },
  { id: '3', address: '910 E Allegheny Ave', zipCode: '19140', opa_account_num: '882-345-6789', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-09-08', owner_name: 'Johnson Properties', property_type: 'Mixed Use', lat: 40.0170, lng: -75.1370 },
  { id: '4', address: '2345 N Front St', zipCode: '19140', opa_account_num: '882-456-7890', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-12-01', owner_name: 'Brown Investments', property_type: 'Residential', lat: 40.0180, lng: -75.1380 },
  { id: '5', address: '3456 W Hunting Park Ave', zipCode: '19140', opa_account_num: '882-567-8901', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-08-14', owner_name: 'Davis Real Estate Trust', property_type: 'Commercial', lat: 40.0190, lng: -75.1390 },
  { id: '6', address: '4567 N Broad St', zipCode: '19140', opa_account_num: '882-678-9012', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-11-30', owner_name: 'Miller Group', property_type: 'Residential', lat: 40.0200, lng: -75.1400 },
  { id: '7', address: '5678 E Roosevelt Blvd', zipCode: '19140', opa_account_num: '882-789-0123', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-07-19', owner_name: 'Wilson LLC', property_type: 'Residential', lat: 40.0210, lng: -75.1410 },
  { id: '8', address: '6789 W Cayuga St', zipCode: '19140', opa_account_num: '882-890-1234', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-10-05', owner_name: 'Anderson Holdings', property_type: 'Residential', lat: 40.0220, lng: -75.1420 },
  
  // ZIP 19134
  { id: '9', address: '2100 E York St', zipCode: '19134', opa_account_num: '332-123-4567', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-11-12', owner_name: 'Thomas Properties', property_type: 'Residential', lat: 39.9850, lng: -75.1250 },
  { id: '10', address: '3200 Frankford Ave', zipCode: '19134', opa_account_num: '332-234-5678', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-09-25', owner_name: 'Garcia Investments', property_type: 'Mixed Use', lat: 39.9860, lng: -75.1260 },
  { id: '11', address: '1800 E Lehigh Ave', zipCode: '19134', opa_account_num: '332-345-6789', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-12-03', owner_name: 'Martinez Holdings', property_type: 'Residential', lat: 39.9870, lng: -75.1270 },
  { id: '12', address: '2900 Kensington Ave', zipCode: '19134', opa_account_num: '332-456-7890', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-08-28', owner_name: 'Robinson Trust', property_type: 'Commercial', lat: 39.9880, lng: -75.1280 },
  { id: '13', address: '4100 E Somerset St', zipCode: '19134', opa_account_num: '332-567-8901', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-10-17', owner_name: 'Clark Realty', property_type: 'Residential', lat: 39.9890, lng: -75.1290 },
  
  // ZIP 19121
  { id: '14', address: '1500 W Susquehanna Ave', zipCode: '19121', opa_account_num: '882-987-6543', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-11-08', owner_name: 'Rodriguez LLC', property_type: 'Residential', lat: 39.9800, lng: -75.1600 },
  { id: '15', address: '2600 N 22nd St', zipCode: '19121', opa_account_num: '882-876-5432', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-09-14', owner_name: 'Lewis Properties', property_type: 'Residential', lat: 39.9810, lng: -75.1610 },
  { id: '16', address: '1700 W Dauphin St', zipCode: '19121', opa_account_num: '882-765-4321', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-10-29', owner_name: 'Lee Investments', property_type: 'Mixed Use', lat: 39.9820, lng: -75.1620 },
  { id: '17', address: '2800 Ridge Ave', zipCode: '19121', opa_account_num: '882-654-3210', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-12-05', owner_name: 'Walker Holdings', property_type: 'Commercial', lat: 39.9830, lng: -75.1630 },
  { id: '18', address: '1900 W Norris St', zipCode: '19121', opa_account_num: '882-543-2109', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-07-23', owner_name: 'Hall Group', property_type: 'Residential', lat: 39.9840, lng: -75.1640 },
  
  // ZIP 19132
  { id: '19', address: '3400 N Broad St', zipCode: '19132', opa_account_num: '582-123-7890', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-11-20', owner_name: 'Allen Trust', property_type: 'Residential', lat: 40.0050, lng: -75.1550 },
  { id: '20', address: '2500 W Lehigh Ave', zipCode: '19132', opa_account_num: '582-234-8901', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-10-11', owner_name: 'Young Properties', property_type: 'Mixed Use', lat: 40.0060, lng: -75.1560 },
  { id: '21', address: '3600 N 15th St', zipCode: '19132', opa_account_num: '582-345-9012', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-09-03', owner_name: 'King Realty', property_type: 'Residential', lat: 40.0070, lng: -75.1570 },
  { id: '22', address: '2700 W Glenwood Ave', zipCode: '19132', opa_account_num: '582-456-0123', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-08-07', owner_name: 'Wright Holdings', property_type: 'Residential', lat: 40.0080, lng: -75.1580 },
  
  // ZIP 19139
  { id: '23', address: '5200 Chestnut St', zipCode: '19139', opa_account_num: '342-789-4561', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-11-27', owner_name: 'Lopez Investments', property_type: 'Commercial', lat: 39.9600, lng: -75.2250 },
  { id: '24', address: '5400 Market St', zipCode: '19139', opa_account_num: '342-890-5672', vacancy_indicator: 'Possibly Vacant', last_inspection: '2024-10-19', owner_name: 'Hill Properties', property_type: 'Mixed Use', lat: 39.9610, lng: -75.2260 },
  { id: '25', address: '800 N 52nd St', zipCode: '19139', opa_account_num: '342-901-6783', vacancy_indicator: 'Likely Vacant', last_inspection: '2024-09-21', owner_name: 'Scott LLC', property_type: 'Residential', lat: 39.9620, lng: -75.2270 },
];

export const searchPropertiesByZipCode = (zipCode: string): VacantProperty[] => {
  // Simulate API delay
  return mockProperties.filter(property => property.zipCode === zipCode);
};

export const getAllZipCodes = (): string[] => {
  return Array.from(new Set(mockProperties.map(p => p.zipCode))).sort();
};

// Simulate cache key generation
export const getCacheKey = (zipCode: string) => `vacancy_data_${zipCode}`;

// Simulate data source timestamp
export const getDataSourceInfo = () => ({
  source: 'City of Philadelphia Open Data (ArcGIS REST API)',
  lastUpdated: new Date().toISOString(),
  endpoint: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vacant_Indicators_Bldg/FeatureServer/0'
});
