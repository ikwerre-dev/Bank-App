import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wallet, ArrowUp, ArrowDown, Plus, Clipboard, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Make sure to install js-cookie: npm install js-cookie
import useUserData from "../components/Data.jsx";

const BalanceCard = ({ type }) => {
  const { userData } = useUserData(); // Access user data
  const [isBalanceVisible, setIsBalanceVisible] = useState(() => {
    // Initialize state from cookie or default to true
    const savedVisibility = Cookies.get('balanceVisibility');
    return savedVisibility !== 'false'; // Default to true if not explicitly set to false
  });

  // Effect to save visibility state to cookie whenever it changes
  useEffect(() => {
    Cookies.set('balanceVisibility', isBalanceVisible.toString(), { expires: 30 }); // Expires in 30 days
  }, [isBalanceVisible]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const copyToClipboard = () => {
    if (userData?.account_number) {
      const tempInput = document.createElement("textarea");
      tempInput.value = userData.account_number;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      Swal.fire({
        icon: "success",
        title: "Copied",
        text: "Account number copied to clipboard!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div
      className="mx-4 my-3 p-4 py-6 rounded-3xl shadow-lg bg-cover bg-center"
      style={{
        background: "linear-gradient(135deg, #2d5674, #308966)",
        backgroundPosition: "center",
      }}
    >
      <p className="text-center flex flex-row gap-2 px-3 items-center text-xs text-gray-300 opacity-80 mb-2">
        <Wallet /> Your Wallet Balance
      </p>
      <div className="flex items-center px-3 py-2 mb-1">
        <h2 className="text-3xl font-bold flex-grow">
          $
          {isBalanceVisible 
            ? (userData?.balance?.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }) || "0.00")
            : "*****"
          }
        </h2>
        {isBalanceVisible ? (
          <Eye 
            className="w-5 h-5 text-white cursor-pointer opacity-70 hover:opacity-100" 
            onClick={toggleBalanceVisibility} 
          />
        ) : (
          <EyeOff 
            className="w-5 h-5 text-white cursor-pointer opacity-70 hover:opacity-100" 
            onClick={toggleBalanceVisibility} 
          />
        )}
      </div>
      {type === 1 ? (
        <div className="flex justify-around">
          <Link to="/deposit" className="flex flex-col items-center">
            <div className="p-3 bg-[#233547] rounded-full">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span className="mt-1 text-xs">Add Money</span>
          </Link>
          <Link to="/send" className="flex flex-col items-center">
            <div className="p-3 bg-[#233547] rounded-full">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span className="mt-1 text-xs">Send</span>
          </Link>
          <Link to="/withdraw" className="flex flex-col items-center">
            <div className="p-3 bg-[#233547] rounded-full">
              <ArrowDown className="w-4 h-4" />
            </div>
            <span className="mt-1 text-xs">Receive</span>
          </Link>
          <Link to="/tra" className="flex flex-col items-center">
            <div className="p-3 bg-[#233547] rounded-full">
              <Plus className="w-4 h-4" />
            </div>
            <span className="mt-1 text-xs">History</span>
          </Link>
        </div>
      ) : (
        <div className="px-3 flex gap-2 items-center">
          <span className="text-sm text-white">
            Account Number: {userData?.account_number || "N/A"}
          </span>
          <Clipboard
            size={15}
            className="cursor-pointer text-gray-400"
            onClick={copyToClipboard}
          />
        </div>
      )}
    </div>
  );
};

export default BalanceCard;