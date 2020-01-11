import React, { useEffect, useState } from 'react';
import { IonListHeader } from '@ionic/react';
import BidList from '../BidList/BidList';
import BidFormModal from '../../pages/BidFormModal';
import axios from 'axios';

const Bids = (props) => {
  const [activeBids, setActiveBids] = useState([]);
  const [completedBids, setCompletedBids] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/bids/').then(res => setActiveBids(res.data));
    axios.get('/api/bids/?completed=true').then(res => setCompletedBids(res.data));
    return () => {
      console.log('unomunted')
    }
  }, []);

  return (
    <>
      <IonListHeader>Active Bids</IonListHeader>
      <BidList
        modal={BidFormModal}
        bids={activeBids}
        setBids={setActiveBids}
        selectedId={selected}
        onClick={setSelected}
        buttonTitle='Re Bids' 
      />
      <IonListHeader>Completed Bids</IonListHeader>
      <BidList 
        modal={BidFormModal} 
        bids={completedBids} 
        setBids={setCompletedBids} 
        selectedId={selected} 
        onClick={setSelected} 
      />
    </>
  );
};

export default Bids;
