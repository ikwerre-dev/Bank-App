import React, { useState, useEffect } from 'react';

import { ChevronLeft, ChevronRight, X, Camera, Clipboard, Info } from 'lucide-react';
import BalanceCard from '../components/BalanceCard';
import { toast } from 'react-toastify';
import { QRCode } from 'react-qr-code';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import useUserData from '../components/Data.jsx'; // Import the custom hook





function App() {
    const [walletAddress, setWalletAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [packages, setpackages] = useState([]);
    const [disabledpackages, setdisabledpackages] = useState([]);
    const [cryptos, setcryptos] = useState([]);
    const [DepositStatus, setDepositStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
    const [isKeypadModalOpen, setisKeypadModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [IntiatePaymentModal, setIntiatePaymentModal] = useState(false);
    const [proof, setProof] = useState(""); // To hold the base64 encoded image
    const { userData, loading, jwt } = useUserData(); // Access the user data and loading state
    const [SubmitButtonText, setSubmitButtonText] = useState('I have Paid'); // State for withdrawal response
    const [SubmitButtonDisabled, setSubmitButtonDisabled] = useState(false); // State for withdrawal response



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    const openPackageModal = () => setIsPackageModalOpen(true);
    const closePackageModal = () => setIsPackageModalOpen(false);


    const openPaymentMethodModal = () => setIsPaymentMethodModalOpen(true);
    const closePaymentMethodModal = () => setIsPaymentMethodModalOpen(false);


    useEffect(() => {

        if (jwt) {
            const fetchData = async () => {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}getAllWallets`, // API endpoint
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`, // Pass JWT in the Authorization header
                            },
                        }
                    );

                    setcryptos(response.data.data);
                    setSelectedCrypto(response.data.data[0])
                    // Set user data
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };

            fetchData();
        } else {
            setLoading(false);  // No JWT means no data; finish loading
        }
    }, []);



    const openIntiatePaymentModal = async (e) => {

        // e.preventDefault();
        setSubmitButtonText('Loading...')
        setSubmitButtonDisabled(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}deposit`, {
                package: selectedPackage,
                method: selectedCrypto,
                amount: amount,
                proof: proof,
            },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`, // Pass JWT in the Authorization header
                    },
                });

            // console.log(response.data)

            if (response.data.status == 1) {
                setSubmitButtonText('I have Paid')
                setSubmitButtonDisabled(false)

                toast.success(response.data.message);
                setIntiatePaymentModal(true)
            } else {
                setSubmitButtonText('I have Paid')
                setSubmitButtonDisabled(false)

                toast.error(response.data.message);
            }


        } catch (error) {
            toast.error('Registration failed. Please try again.');
        }
    };
    const closeIntiatePaymentModal = () => setIntiatePaymentModal(false);


    const openScanner = () => setIsScannerOpen(true);
    const closeScanner = () => setIsScannerOpen(false);
    const handleScan = (data) => {
        if (data) {
            console.log(data[0].rawValue); // Corrected the access to data[0]
            setWalletAddress(data[0].rawValue); // Ensure this is how your data is structured
            closeScanner();
        }

    };

    // Handle scan errors
    const handleError = (err) => {
        console.error(err);
        alert('Error: ' + err);
    };

    const getquote = () => {
        if (amount < selectedPackage.min) {
            toast.error("Minimum amount is $" + selectedPackage.min.toLocaleString());
        } else if (amount > selectedPackage.max) {
            toast.error("Maximum amount is $" + selectedPackage.max.toLocaleString());
        } else {
            openPaymentMethodModal();
        }


    }

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
                        }
                    );
                    setDepositStatus(response.data);  // Set user data
                    // console.log(response.data);  // Set user data
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };

            fetchData();
        } else {
            setLoading(false);  // No JWT means no data; finish loading
        }
    }, []);



    useEffect(() => {

        if (jwt) {
            const fetchData = async () => {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}getAvailablePackages`, // API endpoint
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`, // Pass JWT in the Authorization header
                            },
                        }
                    );
                    setdisabledpackages(response.data.second_data);  // Set user data
                    setpackages(response.data.data);  // Set user data
                    setSelectedPackage(response.data.data[0])
                    // console.log(response.data);  // Set user data
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };

            fetchData();
        } else {
            setLoading(false);  // No JWT means no data; finish loading
        }
    }, []);



    const openKeypadModal = () => setisKeypadModalOpen(true);
    const closeKeypadModal = () => setisKeypadModalOpen(false);

    const openCurrencyModal = () => setIsCurrencyModalOpen(true);
    const closeCurrencyModal = () => setIsCurrencyModalOpen(false);

    const selectCrypto = (crypto) => {
        setSelectedCrypto(crypto);
        closeModal();
    };


    const selectPackage = (Package) => {
        setSelectedPackage(Package);
        closePackageModal();
    };

    const handleKeyPress = (key) => {
        if (key == 'backspace') {
            setAmount(prev => prev.slice(0, -1));
        } else if (key == '.') {
            if (!amount.includes('.')) {
                setAmount(prev => prev + key);
            }
        } else {
            setAmount(prev => prev + key);
        }
    };
    const CompleteKeypad = (amount) => {
        if (amount < 1) amount = 0;

        const formattedAmount = parseFloat(amount).toFixed(2);

        if (amount < selectedPackage.min) {
            toast.error("Minimum amount is $" + selectedPackage.min.toLocaleString());
        } else if (amount > selectedPackage.max) {
            toast.error("Maximum amount is $" + selectedPackage.max.toLocaleString());
        } else {
            setAmount(formattedAmount);
            closeKeypadModal();
        }
    };
    const [selectedMethod, setSelectedMethod] = useState('Credit Card');

    const paymentMethods = [

    ];




    //     const [proof, setProof] = useState(""); // To hold the base64 encoded image

    //     const handleProofChange = (event) => {
    //         const file = event.target.files[0];
    //         if (file) {
    //             const reader = new FileReader();
    //             reader.onloadend = () => {
    //                 setProof(reader.result);
    //             };
    //             reader.readAsDataURL(file);
    //         }
    //     };



    //     return (

    //     );
    // };

    const PaymentMethod = ({ name, providers, qr, data, instruction, isSelected, onClick }) => {

        const handleProofChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProof(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };

        const handleCopy = () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(data)
                    .then(() => {
                        toast.success("Copied to Clipboard!");
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        toast.error("Failed to copy!");
                    });
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = data;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    toast.success("Copied to Clipboard!");
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    toast.error("Failed to copy!");
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        };

        return (
            <div
                className="flex border border-sm rounded-2xl border-blue-200 items-center py-5 px-6 cursor-pointer"

            >
                <div className="flex-grow">
                    <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>{name}</p>

                    <div className="items-center flex justify-center mt-5">
                        {qr && (
                            <div className="mt-2">
                                <QRCode value={data} size={100} />
                            </div>
                        )}
                    </div>
                    <p onClick={handleCopy} className="text-sm flex justify-between text-black mt-5">
                        {data}
                        <button className="flex items-center">
                            <Clipboard size={15} />
                        </button>
                    </p>
                    <p className='text-xs my-3 flex gap-2 text-gray-500'><Info size={15} /> {instruction}</p>
                    <hr className='my-2' />
                    <div className="">
                        <label htmlFor="proof" className='text-xs'>Upload Proof of Deposit</label>
                        <input
                            type="file"
                            name='proof'
                            id="proof"
                            accept="image/*"
                            className="w-full text-xs"
                            title="Enter Proof of Deposit"
                            onChange={handleProofChange}
                        />
                    </div>
                    {proof && (
                        <div className="mt-4">
                            <img src={proof} alt="Proof of deposit preview" className="w-full h-auto" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderInputFields = () => {
        switch (selectedMethod) {
            case 'Credit Card':
            case 'Debit Card':
                return (
                    <>
                        <input className="w-full p-2 border rounded" placeholder="Card Number" />
                        <div className="flex space-x-2">
                            <input className="w-1/2 p-2 border rounded" placeholder="MM/YY" />
                            <input className="w-1/2 p-2 border rounded" placeholder="CVV" />
                        </div>
                        <input className="w-full p-2 border rounded" placeholder="Cardholder Name" />
                    </>
                );
            case 'Bank Transfer':
                return (
                    <>
                        <input className="w-full p-2 border rounded" placeholder="Account Number" />
                        <input className="w-full p-2 border rounded" placeholder="Routing Number" />
                        <input className="w-full p-2 border rounded" placeholder="Account Holder Name" />
                    </>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>; // Display loading state
    }
    return (
        <div className="flex flex-col h-screen mb-[5rem] py-5 bg-[#270685] text-white">

            <BalanceCard amount={userData ? userData.balance : 0} type={2} /> 

            <div className="bg-white text-black p-4 px-6 rounded-t-3xl mt-4 flex-grow">
                <h3 className="font-bold mb-4">Add Money</h3>
                <div className=" h-100 grid relative overflow-hidden">
                  <p>Contact Support to Process your deposit or Share your Account Number to Another User on this bank to do an internal Transfer</p>
                </div>
            </div>
        </div>
    );
}
export default App;