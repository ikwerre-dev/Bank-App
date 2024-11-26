import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import BalanceCard from "../components/BalanceCard";
import useUserData from "../components/Data.jsx";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import {
  Building2,
  CircleDollarSign,
  Globe2,
  Wallet,
  ArrowRightLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Swal from "sweetalert2";
import SuspendedAccountPage from "../components/Suspension.jsx";

const Withdraw = () => {
  const { userData, loading, jwt } = useUserData();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transferType, setTransferType] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
    recipientName: "",
    bankName: "",
    swiftCode: "",
    routingNumber: "",
    recipientAddress: "",
    purpose: "",
    description: "",
    email: "",
    phoneNumber: "",
    cashTag: "",
  });
  const [resolvedName, setResolvedName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const transferTypes = [
    {
      value: "internal",
      label: "P2P",
      icon: Building2,
      color: "bg-blue-100",
    },
    {
      value: "interbank",
      label: "Local Transfer",
      icon: ArrowRightLeft,
      color: "bg-green-100",
    },
    {
      value: "international",
      label: "International Transfer",
      icon: Globe2,
      color: "bg-purple-100",
    },
    {
      value: "paypal",
      label: "PayPal Transfer",
      icon: Wallet,
      color: "bg-yellow-100",
    },
    {
      value: "cashapp",
      label: "Cash App",
      icon: CircleDollarSign,
      color: "bg-pink-100",
    },
  ];

  useEffect(() => {
    if (formData.accountNumber.length == 10 && transferType == "internal") {
      resolveAccountName();
    }
  }, [formData.accountNumber]);

  useEffect(() => {
    let timer;
    if (showSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown == 0) {
      setShowConfetti(false);
      setShowSuccess(false);
      navigate("/dashboard");
    }
    return () => clearInterval(timer);
  }, [showSuccess, countdown, navigate]);

  const resolveAccountName = async () => {
    setIsResolving(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}resolve-account`,
        { account_number: formData.accountNumber },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );
      console.log(response.data);
      setResolvedName(response.data.accountName);
      // toast.success("Account name resolved successfully");
    } catch (error) {
      toast.error("Failed to resolve account name");
      setResolvedName(404);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}transfer`,
        {
          transferType,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );
      console.log(response.data);
      if (response.data.status == 1) {
        setShowConfetti(true);
        setShowSuccess(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowSuccess(false);
          navigate("/dashboard");
        }, 5000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransferTypeSelect = (type) => {
    setTransferType(type);
    setShowOptions(false);
  };

  const SuccessOverlay = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-2xl text-center animate-fade-in">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Transfer Successful!</h2>
          <p className="text-gray-600 text-lg mb-4">
            ${formData.amount} sent successfully
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              To:{" "}
              {resolvedName
                ? resolvedName
                : formData.recipientName
                  ? formData.recipientName
                  : formData.accountNumber}
            </p>
            <p className="text-xs text-gray-500 mt-1">{formData.description}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Redirecting in {countdown} seconds
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${(5 - countdown) * 20}%`,
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
    <div className="flex flex-col h-screen mb-20  bg-[#233547] text-white">
      {userData && userData.status == 1 ? (
        <SuspendedAccountPage />
      ) : (
        <>
          <BalanceCard type={2} />
          {showConfetti && <Confetti />}
          {showSuccess && <SuccessOverlay />}

          <div className="bg-white text-black p-4 px-6 pb-[6rem] rounded-t-3xl mt-4 flex-grow">
            <h3 className="font-bold mb-4">Send Money</h3>
            <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Type
                </label>
                {showOptions ? (
                  <div className="grid grid-cols-2 gap-2">
                    {transferTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTransferTypeSelect(type.value)}
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
                        transferTypes.find((t) => t.value == transferType)
                          .icon,
                        { className: "w-5 h-5 mr-2" },
                      )}
                      <span className="text-sm">
                        {
                          transferTypes.find((t) => t.value == transferType)
                            .label
                        }
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

              {transferType && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Internal Transfer Fields */}
                  {transferType == "internal" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="number"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          maxLength={10}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        {isResolving && (
                          <p className="text-sm text-gray-500 mt-1">
                            Resolving account name...
                          </p>
                        )}
                        {resolvedName && resolvedName != 404 ? (
                          <p className="text-sm text-green-600 mt-1">
                            Account Name: {resolvedName}
                          </p>
                        ) : (
                          <p className="text-sm text-red-600 mt-1">
                            Account Not Found
                          </p>
                        )}
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
                          placeholder="What's it for?"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
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
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* PayPal Transfer Fields */}
                  {transferType == "paypal" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PayPal Email
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
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
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
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Cash App Fields */}
                  {transferType == "cashapp" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          $Cashtag
                        </label>
                        <input
                          type="text"
                          name="cashTag"
                          value={formData.cashTag}
                          onChange={handleInputChange}
                          placeholder="$username"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Note
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="What's it for?"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
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
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Inter-bank Transfer Fields */}
                  {transferType == "interbank" && (
                    <>
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
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Routing Number
                        </label>
                        <input
                          type="text"
                          name="routingNumber"
                          value={formData.routingNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* International Transfer Fields */}
                  {transferType == "international" && (
                    <>
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
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SWIFT Code
                        </label>
                        <input
                          type="text"
                          name="swiftCode"
                          value={formData.swiftCode}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Address
                        </label>
                        <textarea
                          name="recipientAddress"
                          value={formData.recipientAddress}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Purpose of Transfer
                        </label>
                        <input
                          type="text"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold mt-6"
                  >
                    Send Money
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Withdraw;
