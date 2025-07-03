import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { MapPin, Globe } from 'lucide-react';

const LocationSelector = ({ value = '', onChange = () => {} }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [pincode, setPincode] = useState('');
  const [pinLocation, setPinLocation] = useState(null);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState('');
    setSelectedCity('');
    const countryStates = State.getStatesOfCountry(countryCode);
    setStates(countryStates);
    setCities([]);
    onChange('');
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity('');
    const stateCities = City.getCitiesOfState(selectedCountry, stateCode);
    setCities(stateCities);
    onChange('');
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const countryName = countries.find(c => c.isoCode === selectedCountry)?.name || '';
    const stateName = states.find(s => s.isoCode === selectedState)?.name || '';
    const locationString = `${cityName}, ${stateName}, ${countryName}`;
    onChange(locationString);
  };

  const handlePincodeSearch = async () => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0].Status === 'Success') {
        const post = data[0].PostOffice[0];
        setPinLocation(post);
        const locationStr = `${post.Name}, ${post.District}, ${post.State}, ${post.Country}`;
        onChange(locationStr);
      } else {
        setPinLocation(null);
        onChange('');
      }
    } catch (error) {
      console.error('Error fetching pincode info', error);
      setPinLocation(null);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto p-6 bg-base-100 shadow-md rounded-xl">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Globe className="w-5 h-5" /> Select Your Location
      </h2>

      {/* Country */}
      <div className="form-control">
        <label className="label font-semibold">Country</label>
        <select
          className="select select-bordered"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      {states.length > 0 && (
        <div className="form-control">
          <label className="label font-semibold">State</label>
          <select
            className="select select-bordered"
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* City */}
      {cities.length > 0 && (
        <div className="form-control">
          <label className="label font-semibold">City</label>
          <select
            className="select select-bordered"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select City</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="divider text-sm">OR</div>

      {/* Pincode */}
      <div className="form-control">
        <label className="label font-semibold">Search by Pincode</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Indian Pincode"
            className="input input-bordered w-full"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handlePincodeSearch}>
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pin location result */}
      {pinLocation && (
        <div className="bg-base-200 p-4 rounded-md text-sm space-y-1 border-l-4 border-primary mt-2">
          <p><strong>Post Office:</strong> {pinLocation.Name}</p>
          <p><strong>District:</strong> {pinLocation.District}</p>
          <p><strong>State:</strong> {pinLocation.State}</p>
          <p><strong>Country:</strong> {pinLocation.Country}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
