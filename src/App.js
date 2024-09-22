import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { BsCheckSquareFill, BsPencilSquare } from "react-icons/bs";
import { FaExclamationTriangle } from "react-icons/fa";

const FullPageApp = () => {
  const [inputData, setInputData] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["Numbers", "Top Alphabet"]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setApiResponse(null);

    try {
      const parsedData = JSON.parse(inputData);
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const responseData = await response.json();
      setApiResponse(responseData);
    } catch (err) {
      setErrorMessage(
        err.message === "Failed to fetch"
          ? "Server connection error"
          : "Invalid input format, please check JSON structure."
      );
    }
  };

  const toggleFilterSelection = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const displayApiResponse = () => {
    if (!apiResponse) return null;

    return (
      <div className="custom-response-section bg-gray-50 p-4 rounded-lg mt-5 shadow-lg">
        <h3 className="text-xl font-bold mb-3">Output</h3>
        {selectedFilters.includes("Numbers") && (
          <div className="text-blue-600">
            <BsCheckSquareFill className="inline-block mr-2" />
            Numbers: {apiResponse.numbers.join(",")}
          </div>
        )}
        {selectedFilters.includes("Top Alphabet") && (
          <div className="text-green-600">
            <BsPencilSquare className="inline-block mr-2" />
            Top Alphabet: {apiResponse.highest_alphabet.join("")}
          </div>
        )}
        {selectedFilters.includes("Alphabets") && (
          <div className="text-red-600">
            <BsCheckSquareFill className="inline-block mr-2" />
            Alphabets: {apiResponse.alphabets.join(",")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="full-page-container min-h-screen bg-gradient-to-r from-purple-400 to-indigo-600 flex flex-col justify-center items-center">
      <div className="main-container p-6 h-full w-full max-w-lg bg-gradient-to-br from-blue-500 to-blue-700 transition-all duration-500 rounded-lg flex flex-col justify-center shadow-xl hover:from-blue-700 hover:to-blue-500">
        <h1 className="app-title text-3xl font-extrabold mb-5 text-white text-center">
          Data Insight Explorer
        </h1>
        <form onSubmit={handleFormSubmit} className="mb-5">
          <label
            htmlFor="api-input"
            className="block text-lg font-medium text-white mb-2"
          >
            Input (JSON format)
          </label>
          <textarea
            id="api-input"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="input-box w-full p-4 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            rows="4"
            placeholder='{"data":[]}'
          />
          <button
            type="submit"
            className="submit-btn w-full bg-indigo-600 text-white py-3 mt-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
          >
            Filter it out..
          </button>
        </form>

        {apiResponse && (
          <div className="filter-dropdown mt-4 relative">
            <button
              onClick={() => setDropdownVisible(!isDropdownVisible)}
              className="filter-btn w-full bg-gray-200 text-left py-3 px-5 rounded-lg flex justify-between items-center shadow-sm hover:bg-gray-300 transition-all duration-300"
            >
              <span>Filter Options</span>
              <FiChevronDown className="icon-down h-6 w-6" />
            </button>
            {isDropdownVisible && (
              <div className="dropdown-menu absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {["Numbers", "Top Alphabet", "Alphabets"].map((filter) => (
                  <label
                    key={filter}
                    className="dropdown-item flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilterSelection(filter)}
                      className="mr-2"
                    />
                    <span>{filter}</span>
                    {selectedFilters.includes(filter) && (
                      <AiOutlineClose
                        className="ml-2 text-red-500"
                        onClick={() => toggleFilterSelection(filter)}
                      />
                    )}
                  </label>
                ))}
              </div>
            )}
            <div className="selected-filters mt-3 flex flex-wrap">
              {selectedFilters.map((filter) => (
                <span
                  key={filter}
                  className="filter-tag bg-indigo-100 text-sm rounded-lg px-4 py-2 m-1 flex items-center"
                >
                  {filter}
                  <AiOutlineClose
                    className="icon-close ml-2 cursor-pointer"
                    onClick={() => toggleFilterSelection(filter)}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        {displayApiResponse()}

        {errorMessage && (
          <div
            className="error-message mt-5 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md flex items-center"
            role="alert"
          >
            <FaExclamationTriangle className="mr-3 h-6 w-6 text-red-700" />
            <span className="font-semibold">Error:</span>
            <span className="ml-2">{errorMessage}</span>
          </div>
        )}
      </div>
      <footer className="footer mt-10 text-white text-center">
        <p className="text-lg">Made by Disha</p>
      </footer>
    </div>
  );
};

export default FullPageApp;
