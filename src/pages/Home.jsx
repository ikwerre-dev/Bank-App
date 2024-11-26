import React, { useState, useEffect } from "react";
import { Ellipsis, Link2 } from "lucide-react";
import user from "../assets/user.png";
import TransactionHistory from "../components/TransactionHistory";
import BalanceCard from "../components/BalanceCard";
import Header from "../components/Header";
import useUserData from "../components/Data.jsx"; // Import the custom hook
import axios from "axios";
import { Link } from "react-router-dom";
import ReferralsComponent from "../components/ReferralsComponent.jsx";
import {
  Smartphone,
  Receipt,
  Building2,
  Clock,
  Zap,
  Film,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  Phone,
  Music,
  Tv,
  CreditCard,
  Droplets,
  PlayCircle,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import SuspendedAccountPage from "../components/Suspension.jsx";
const BankingHomeScreen = () => {
  const { userData, loading, jwt } = useUserData(); // Access the user data and loading state
  const [DepositStatus, setDepositStatus] = useState("");

  const services = [
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Electricity",
      bgColor: "bg-yellow-100",
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      label: "Water",
      bgColor: "bg-blue-300",
    },
    {
      icon: <PlayCircle className="h-6 w-6" />,
      label: "Netflix",
      bgColor: "bg-red-200",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      label: "Amazon Prime",
      bgColor: "bg-orange-100",
    },
    {
      icon: <PlayCircle className="h-6 w-6" />,
      label: "Disney+",
      bgColor: "bg-blue-200",
    },
    {
      icon: <Tv className="h-6 w-6" />,
      label: "Apple TV",
      bgColor: "bg-gray-100",
    },
    {
      icon: <Music className="h-6 w-6" />,
      label: "Spotify",
      bgColor: "bg-green-200",
    },
    {
      icon: <Ellipsis className="h-6 w-6" />,
      label: "More",
      bgColor: "bg-blue-300",
    },
  ];

  useEffect(() => {
    if (jwt) {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}getLastDeposit`, // API endpoint
            {},
            {
              headers: {
                Authorization: `Bearer ${jwt}`, // Pass JWT in the Authorization header
              },
            },
          );
          setDepositStatus(response.data); // Set user data
          // console.log(response.data);  // Set user data
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchData();
    } else {
      setLoading(false); // No JWT means no data; finish loading
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    ); // Display loading state
  }

  return (
    <div className="flex flex-col h-screen mb-[5rem] bg-white text-white">
      <Header />

      {userData && userData.status == 1 ? (
        <SuspendedAccountPage />
      ) : (
        <>
          <div className="px-0">
            <BalanceCard amount={userData ? userData.balance : 0} type={1} />
          </div>

          <div className=" mt-0  px-4 py-3   flex-grow">
            <div className="bg-[#233547] shadow-lg  text-white rounded-3xl p-4">
              <h2 className="text-lg font-medium mb-4">Other Services</h2>
              <div className="grid grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={`/pay`}
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    <div
                      className={`${service.bgColor} p-3 rounded-full text-black flex items-center justify-center`}
                    >
                      {service.icon}
                    </div>
                    <span className="text-xs text-center text-gray-200">
                      {service.label}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-[2rem] py-5">
                <TransactionHistory type={2} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BankingHomeScreen;
