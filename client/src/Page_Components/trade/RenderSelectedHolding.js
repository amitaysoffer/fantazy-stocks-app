import React from 'react'

function RenderSelectedHolding(props) {
  // debugger
  // const { company, share_number, symbol, share_price } = props.holding
  const { companyName, latestPrice, changePercent, change } = props.holding;

  // debugger
  return (
    <div className="selected-holding card mt-5">
      <div className="card-head">
        {/* <div> */}
        <h2><strong> {companyName}</strong></h2>
        {/* </div> */}
        <div className="card-buttons">
          <button className="btn btn-danger">Buy</button>
          <button className="btn btn-danger">Sell</button>
        </div>
      </div>
      <hr />
      <div className="card-body">
        <div className="price">
          <strong>Current Price</strong>
          <p>{latestPrice}</p>
        </div>
        <div className="percent">
          <strong>Percent Change</strong>
          <p>{changePercent}</p>
        </div>
        <div className="change">
          <strong>Daily Gain/Loss</strong>
          <p>{change}</p>
        </div>
        <div className="shares-held">
          <strong>Shares Held</strong>
          <p>10</p>
        </div>

      </div>

    </div>
  )
}

export default RenderSelectedHolding