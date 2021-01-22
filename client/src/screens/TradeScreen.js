import React, { useState, useEffect } from 'react';
import qa from 'qs';
import { searchForHolding, createHolding, deleteHolding, getHoldings, updateHolding } from '../http-helpers/tradeUtilities'
import Recommendations from '../components/Recommendations'
import SelectedHolding from '../components/SelectedHolding'
import HeaderTrade from '../components/headers/HeaderTrade'
import Form from '../components/Form'
import ShowAlert from '../components/ShowAlert'
import { withRouter } from 'react-router-dom';

const TradeScreen = (props) => {
  const [holdings, setHoldings] = useState([]);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [sharesPurchased, setSharesPurchased] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchHoldingsData = () => {
      getHoldings()
        .then(holdingsData => setHoldings(holdingsData))
        .catch(err => console.error('error get holdings', err));
    }

    const renderSearchedHoldingFromPortfolio = () => {
      const queryStrings = qa.parse(
        props.location.search,
        { ignoreQueryPrefix: true });
      if (queryStrings.symbol) {
        handleSearchForHolding(queryStrings.symbol)
      }
    }

    renderSearchedHoldingFromPortfolio();
    fetchHoldingsData();
  }, []);

  const updateShares = (shares) => {
    setSharesPurchased(shares);
  }

  const toggleAlertState = () => {
    setIsShowAlert(prevState => !prevState);
  }

  const handleSearchForHolding = (symbol) => {
    searchForHolding(symbol)
      .then(selectedHolding => setSelectedHolding(selectedHolding))
      .catch(err => console.error('error get holdings', err));
  };

  const sellShares = (shares) => {
    const holding = holdings.find(holding => holding.symbol == selectedHolding.symbol);
    updateHolding(holding.holding_id, holding.shares - shares);
    setAlertMessage('sold');
    toggleAlertState()
    shares == holding.shares &&
      deleteHolding(holding.holding_id);
  }

  const buyNewHolding = (shares) => {
    const matchingHolding = holdings.find(
      (holding) => holding.symbol === selectedHolding.symbol);
    if (matchingHolding) {
      const matchIndex = holdings.indexOf(matchingHolding);
      holdings[matchIndex].shares = parseInt(holdings[matchIndex].shares) + parseInt(shares);
      updateHolding(matchingHolding.holding_id, matchingHolding.shares);
      setAlertMessage('purchased');
      toggleAlertState();
    } else {
      const newShare = {
        symbol: selectedHolding.symbol,
        companyName: selectedHolding.companyName,
        shares: shares,
        price: selectedHolding.latestPrice,
        change: selectedHolding.change,
        changePercent: selectedHolding.changePercent,
      };
      createHolding(newShare);
      setAlertMessage('purchased');
      toggleAlertState()
    }
  };

  return (
    <section >
      <HeaderTrade />
      <div className="container">
        {isShowAlert &&
          <ShowAlert
            toggleAlertState={toggleAlertState}
            isShowAlert={isShowAlert}
            selectedHolding={selectedHolding}
            sharesPurchased={sharesPurchased}
            alertMessage={alertMessage}
          />}
        <Form handleSearchForHolding={handleSearchForHolding} />
        {selectedHolding ?
          <SelectedHolding
            selectedHolding={selectedHolding}
            buyNewHolding={buyNewHolding}
            sellShares={sellShares}
            updateShares={updateShares}
          />
          : null}
        <Recommendations
          handleSearchForHolding={handleSearchForHolding}
        />
      </div>
    </section>
  )
}

export default withRouter(TradeScreen)