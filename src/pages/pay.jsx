import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import BalanceCard from "../components/BalanceCard";
import useUserData from "../components/Data.jsx";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { Zap, Phone, Music, Tv, CreditCard, Droplets, PlayCircle, ShoppingCart, CheckCircle } from 'lucide-react';
import Swal from "sweetalert2";

const Pay = () => {
  const { userData, loading, jwt } = useUserData();
   const [showConfetti, setShowConfetti] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [paymentType, setPaymentType] = useState("");
   const [showOptions, setShowOptions] = useState(true);
   const [countdown, setCountdown] = useState(5);
   const [formData, setFormData] = useState({
     accountNumber: "",
     amount: "",
     description: "",
     email: "",
     package: "",
     company: "",
   });
   const navigate = useNavigate();
 
   useEffect(() => {
     window.scrollTo(0, 0);
   }, []);
 
   useEffect(() => {
     let timer;
     if (showSuccess && countdown > 0) {
       timer = setInterval(() => {
         setCountdown((prevCount) => prevCount - 1);
       }, 1000);
     } else if (countdown === 0) {
       setShowConfetti(false);
       setShowSuccess(false);
       navigate("/dashboard");
     }
     return () => clearInterval(timer);
   }, [showSuccess, countdown, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentTypes = [
    { value: "electricity", label: "Electricity", icon: Zap, color: "bg-yellow-100" },
    { value: "water", label: "Water", icon: Droplets, color: "bg-blue-300" },
    { value: "netflix", label: "Netflix", icon: PlayCircle, color: "bg-red-200" },
    { value: "amazon", label: "Amazon Prime", icon: ShoppingCart, color: "bg-orange-100" },
    { value: "disneyplus", label: "Disney+", icon: PlayCircle, color: "bg-blue-200" },
    { value: "appletv", label: "Apple TV", icon: Tv, color: "bg-gray-100" },
    { value: "spotify", label: "Spotify", icon: Music, color: "bg-green-200" },
  ];

  const utilityCompanies = {
    electricity: [
      { id: "pge", name: "Pacific Gas and Electric Company (PG&E)" },
      { id: "sce", name: "Southern California Edison (SCE)" },
      { id: "sdge", name: "San Diego Gas & Electric (SDG&E)" },
      { id: "ladwp", name: "Los Angeles Department of Water and Power (LADWP)" },
      { id: "coned", name: "Consolidated Edison (Con Edison)" },
      { id: "duke", name: "Duke Energy" },
      { id: "fpl", name: "Florida Power & Light (FPL)" },
      { id: "exelon", name: "Exelon Corporation" },
      { id: "aep", name: "American Electric Power (AEP)" },
      { id: "nationalgrid", name: "National Grid" },
      { id: "firstenergy", name: "FirstEnergy Corp" },
      { id: "entergy", name: "Entergy Corporation" },
      { id: "xcelenergy", name: "Xcel Energy" },
      { id: "dominion", name: "Dominion Energy" },
      { id: "ppl", name: "PPL Corporation" },
      { id: "dteenergy", name: "DTE Energy" },
      { id: "ameren", name: "Ameren Corporation" },
      { id: "eversource", name: "Eversource Energy" },
      { id: "pseg", name: "Public Service Enterprise Group (PSEG)" },
      { id: "cps", name: "CPS Energy" },
    ],
    water: [
      { id: "awwa", name: "American Water Works Association" },
      { id: "sfpuc", name: "San Francisco Public Utilities Commission" },
      { id: "ladwp", name: "Los Angeles Department of Water and Power" },
      { id: "nycdep", name: "New York City Department of Environmental Protection" },
      { id: "dcwater", name: "DC Water" },
      { id: "mwra", name: "Massachusetts Water Resources Authority" },
      { id: "wssc", name: "Washington Suburban Sanitary Commission" },
      { id: "ebmud", name: "East Bay Municipal Utility District" },
      { id: "denverwater", name: "Denver Water" },
      { id: "tampabaywater", name: "Tampa Bay Water" },
      { id: "glwater", name: "Great Lakes Water Authority" },
      { id: "lvvwd", name: "Las Vegas Valley Water District" },
      { id: "phxwater", name: "City of Phoenix Water Services Department" },
      { id: "austinwater", name: "Austin Water" },
      { id: "houstonwater", name: "Houston Water" },
      { id: "miamidadewater", name: "Miami-Dade Water and Sewer Department" },
      { id: "seattlepublicutilities", name: "Seattle Public Utilities" },
      { id: "portlandwater", name: "Portland Water Bureau" },
      { id: "atlantawatershed", name: "Atlanta Department of Watershed Management" },
      { id: "baltimorewaterworks", name: "Baltimore City Department of Public Works" },
    ],
  };

  const streamingPackages = {
    netflix: [
      { id: "basic", name: "Basic", price: 8.99 },
      { id: "standard", name: "Standard", price: 13.99 },
      { id: "premium", name: "Premium", price: 17.99 },
    ],
    amazon: [
      { id: "monthly", name: "Monthly", price: 14.99 },
      { id: "annual", name: "Annual", price: 139 },
    ],
    disneyplus: [
      { id: "monthly", name: "Monthly", price: 7.99 },
      { id: "annual", name: "Annual", price: 79.99 },
    ],
    appletv: [
      { id: "monthly", name: "Monthly", price: 4.99 },
      { id: "annual", name: "Annual", price: 49.99 },
    ],
    spotify: [
      { id: "individual", name: "Individual", price: 9.99 },
      { id: "duo", name: "Duo", price: 12.99 },
      { id: "family", name: "Family", price: 15.99 },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}vtu-payment`,
        {
          paymentType,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );
      console.log(response.data)
      if (response.data.status === 1) {
        setShowConfetti(true);
        setShowSuccess(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowSuccess(false);
          navigate("/dashboard");
        }, 5000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'package' && streamingPackages[paymentType]) {
      const selectedPackage = streamingPackages[paymentType].find(pkg => pkg.id === value);
      if (selectedPackage) {
        setFormData(prevState => ({
          ...prevState,
          amount: selectedPackage.price.toString(),
        }));
      }
    }
  };

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    setShowOptions(false);
    setFormData({
      accountNumber: "",
      amount: "",
      description: "",
      email: "",
      package: "",
      company: "",
    });
  };

  
  const SuccessOverlay = () => {
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-2xl text-center animate-fade-in">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 text-lg mb-4">
            ${formData.amount} paid successfully
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              For: {paymentTypes.find(type => type.value === paymentType)?.label}
            </p>
            <p className="text-xs text-gray-500 mt-1">{formData.description}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Redirecting in {countdown} seconds</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{
                  width: `${(5 - countdown) * 20}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen mb-20 bg-[#233547] text-white">
      <BalanceCard type={2} />
      {showConfetti && <Confetti />}
      {showSuccess && <SuccessOverlay />}

      <div className="bg-white text-black p-4 px-6 pb-[6rem] rounded-t-3xl mt-4 flex-grow">
        <h3 className="font-bold mb-4">VTU Payment</h3>
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            {showOptions ? (
              <div className="grid grid-cols-2 gap-2">
                {paymentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handlePaymentTypeSelect(type.value)}
                    className={`flex items-center justify-center p-3 rounded-lg ${type.color} transition-all duration-300 transform hover:scale-105`}
                  >
                    <type.icon className="w-5 h-5 mr-2" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100">
                <div className="flex items-center">
                  {React.createElement(
                    paymentTypes.find((t) => t.value === paymentType).icon,
                    { className: "w-5 h-5 mr-2" },
                  )}
                  <span className="text-sm">
                    {paymentTypes.find((t) => t.value === paymentType).label}
                  </span>
                </div>
                <button
                  onClick={() => setShowOptions(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {paymentType && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {['electricity', 'water'].includes(paymentType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a company</option>
                    {utilityCompanies[paymentType].map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {['netflix', 'amazon', 'disneyplus', 'appletv', 'spotify'].includes(paymentType) ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package
                    </label>
                    <select
                      name="package"
                      value={formData.package}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select a package</option>
                      {streamingPackages[paymentType].map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - ${pkg.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number / Customer ID
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-8 border rounded-md focus:ring-2 focus:ring-indigo-500 text-2xl"
                    required
                    readOnly={['netflix', 'amazon', 'disneyplus', 'appletv', 'spotify'].includes(paymentType)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a note"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold mt-6"
              >
                Pay Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pay;

