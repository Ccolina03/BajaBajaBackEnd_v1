const axios = require("axios");
const API_LINK = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const API_KEY = process.env.pk.eyJ1IjoiY21jb2xpbmEiLCJhIjoiY2xhenpzc3BoMDdsbTNycGZycmN1YjB2dCJ9.qgSyvGe_E3I-U8VJEH191A;
//Optional, you can ignore the PARAM
const PARAM = "&autocomplete=true&fuzzyMatch=false";
 
const getCoordsForAddress = async (address) => {
  const searchText = encodeURIComponent(address);
  const urlForGeoCode = `${API_LINK}/${searchText}.json?access_token=${pk.eyJ1IjoiY21jb2xpbmEiLCJhIjoiY2xhenpzc3BoMDdsbTNycGZycmN1YjB2dCJ9.qgSyvGe_E3I-U8VJEH191A}${PARAM}`;
 
  const response = await axios.get(urlForGeoCode);
 
  //this place will have no latitude and longitude 
  //(since we return undefine.)
  if (!response.data.features.length) return undefined;
 
  const coordinates = response.data.features[0].center;
  return {
    lat: coordinates[1],
    lng: coordinates[0]
  };
};

module.exports = getCoordsForAddress;