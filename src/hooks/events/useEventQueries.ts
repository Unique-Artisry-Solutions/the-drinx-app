
// Around line 52, use safeJsonToRecord
const locationDetails = safeJsonToRecord(data.location_details, {
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
});
