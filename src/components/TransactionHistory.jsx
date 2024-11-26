import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUp, Link2, Plus } from 'lucide-react';
import useUserData from '../components/Data.jsx';
import { Link } from 'react-router-dom';

const TransactionPopup = ({ transaction, onClose }) => {
  const popupRef = useRef(null);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to render transfer type specific details
  const renderTransferDetails = () => {
    switch (transaction.transfer_type) {
      case 'internal':
        return (
          <div className="mb-4">
            <p className="text-gray-600 font-bold ">Internal Transfer Details:</p>
            <p className='text-gray-500'>Sender Account: {transaction.sender_account_number}</p>
            <p className='text-gray-500'>Recipient Account: {transaction.recipient_account_number}</p>
          </div>
        );
      
      case 'interbank':
        return (
          <div className="mb-4">
            <p className="text-gray-600 font-bold ">Interbank Transfer Details:</p>
            <p className='text-gray-500'>Bank Name: {transaction.bank_name}</p>
            <p className='text-gray-500'>Routing Number: {transaction.routing_number}</p>
            <p className='text-gray-500'>Sender Account: {transaction.sender_account_number}</p>
            <p className='text-gray-500'>Recipient Account: {transaction.recipient_account_number}</p>
          </div>
        );
      
      case 'international':
        return (
          <div className="mb-4">
            <p className="text-gray-600 font-bold ">International Transfer Details:</p>
            <p className='text-gray-500'>Recipient Name: {transaction.recipient_name}</p>
            <p className='text-gray-500'>Swift Code: {transaction.swift_code}</p>
            <p className='text-gray-500'>Recipient Address: {transaction.recipient_address}</p>
            <p className='text-gray-500'>Purpose: {transaction.purpose}</p>
            <p className='text-gray-500'>Sender Account: {transaction.sender_account_number}</p>
            <p className='text-gray-500'>Recipient Account: {transaction.recipient_account_number}</p>
          </div>
        );
      
      case 'paypal':
        return (
          <div className="mb-4">
            <p className="text-gray-600 font-bold ">PayPal Transfer Details:</p>
            <p className='text-gray-500'>Email: {transaction.email}</p>
          </div>
        );
      
      case 'cashapp':
        return (
          <div className="mb-4">
            <p className="text-gray-600 font-bold ">Cash App Transfer Details:</p>
            <p className='text-gray-500'>Cash Tag: {transaction.cash_tag}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div ref={popupRef} className="bg-white rounded-t-3xl w-full max-w-md p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <span className="text-3xl  text-black ">
              {transaction.transfer_type === 'internal' ? <ArrowDown size={20} /> : <Link2 size={20} />}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-black text-lg capitalize">{transaction.transfer_type} Transfer</h3>
          </div>
        </div>
        <div className={`rounded-xl p-4 mb-4 font-semibold ${transaction.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
          <span className="font-semibold text-white">
            ${Math.abs(transaction.amount).toFixed(2)}
          </span>
        </div>
        <p className="text-gray-500 mb-4">Transaction no. trns_{transaction.id.toString().padStart(6, '0')}</p>
        <p className="font-mono text-gray-500 text-sm mb-4">{transaction.created_at}</p>
        
        {renderTransferDetails()}
        
        {transaction.description && (
          <div className="mb-4">
            <p className="text-gray-600 font-bold ">Description:</p>
            <p className='text-gray-500'>{transaction.description}</p>
          </div>
        )}
        
        <p className="text-gray-600 font-bold  mb-4">
          Status: <span className="capitalize font-semibold">{transaction.status}</span>
        </p>
        
        <button className="text-red-500 w-full py-2 border border-red-500 rounded-lg mb-2" onClick={onClose}>
          Report a problem
        </button>
        <button className="text-blue-500 w-full py-2" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

const History = ({type}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  const { userData, loading, jwt, UserTransactions } = useUserData(); // Access the user data and loading state
  const TransactionTable = UserTransactions && type == 2 ? UserTransactions.slice(0, 3) : UserTransactions;
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Latest Transactions</h3>
          <Link to={'/history'} className="text-emerald-600 text-sm">View all</Link>
        </div>
        {TransactionTable && TransactionTable.length > 0 ? (
          TransactionTable.map((transaction, index) => (
            <div 
              key={index} 
              className="flex bg-white text-black mt-2 px-5 rounded-l items-center justify-between py-3" 
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">
                    {transaction.transfer_type === 'internal' ? <ArrowDown size={20} /> : <Link2 size={20} />}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize">{transaction.transfer_type} Transfer</p>
                  <p className={`text-xs ${
                    transaction.status === 'pending' ? 'text-orange-500' : 
                    transaction.status === 'completed' ? 'text-green-500' : 
                    'text-red-500'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`font-semibold flex ${
                  transaction.transfer_type === 'internal' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.transfer_type === 'internal' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <ArrowUp className="w-4 h-4 ml-2 transform rotate-45" />
              </div>
            </div>
          ))
        ) : (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-400 text-gray-800 rounded-md">
            <strong className="block font-medium">No Transaction Found</strong>
          </div>
        )}
      </div>
      {selectedTransaction && (
        <TransactionPopup
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
};

export default History;