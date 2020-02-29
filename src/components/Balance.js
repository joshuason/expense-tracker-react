import React from 'react';

const Balance = props => {
  return (
    <div id="balance">
      <p>Your balance: {props.balance}</p>
      <div className="details">
        <p>Income: {props.income}</p>
        <p>Expenses: {props.expenses}</p>
      </div>
    </div>
  )
}

export default Balance;
