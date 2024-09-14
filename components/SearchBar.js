import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css'; // Ensure you have this CSS file

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data from the JSON link (replace the URL with your actual data link)
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setData(response.data);
        setError(''); // Clear any previous error
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      });
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 1) {
      const filteredSuggestions = data.filter(item =>
        (item.name && item.name.common.toLowerCase().includes(input.toLowerCase())) ||
        (item.capital && item.capital[0] && item.capital[0].toLowerCase().includes(input.toLowerCase()))
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name.common);
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a country or capital..."
        value={query}
        onChange={handleChange}
      />
      {error && <p className="error-message">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSuggestionClick(item)}>
              <strong>{item.name.common}</strong> - {item.capital && item.capital[0]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
