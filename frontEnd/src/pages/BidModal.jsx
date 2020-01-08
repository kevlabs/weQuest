import React, { useState, useEffect, useCallback } from 'react';

import Modal from '../components/Modal';
import ErrorAlert from '../components/ErrorAlert';
import BidList from "../components/BidList/BidList";

// component should be passed a function to select the winning bid
// also need requestId
// need to fetch data whenever requestId changes
// need to control state of expanded bid (or should bid list do it? - YES)
// component need to make an axios call when winning bid selected - PUT TO REQUESTS ROUTE

export default function BidModal({ showModal, setShowModal, request, updateRequestById }) {

  console.log('rendering bid');

  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // bids data - from server
  const [bids, setBids] = useState({});

  const selectWinner = useCallback((bidId) => {
    console.log('selecting winning bid');
    
    setShowSpinner('Saving...');

    // TODO: replace resolve with axios call
    new Promise((resolve) => {
      setTimeout(() => resolve({}), 3000);
    })
    // axios.post('/api/requests', 'TBD')
    .then(() => {
      setShowModal(false);
      // updateRequestById(requestId, { priceCent });
    })
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setShowSpinner(false));

  }, []);

  // load product data
  useEffect(() => {

    console.log('Load initial bid data');
    setShowSpinner(true);
    
    // TODO: replace resolve with axios call
    new Promise((resolve) => {
      setTimeout(() => resolve({}), 3000);
    })
    // axios.get(`/api/requests/${request.id}/bids`)
    // .then(({ data: products }) => {
      // setBids(data);
    // })
    .catch((err) => setErrorMessage(err.message))
    .finally(() => setShowSpinner(false));

  }, [request.id]);

  return (
    <Modal {...{ showModal, setShowModal, showSpinner, title: `Bids for ${ request.id}` }}>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <BidList {...{ selectWinner }} />
    </Modal>
  );
}