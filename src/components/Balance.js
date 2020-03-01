import React from 'react';

const Balance = props => {
  return (
    <div id="balance">
      <p>Your balance: {props.balance}</p>
      <p>Income: {props.income}</p>
      <p>Expenses: {props.expenses}</p>
    </div>
  )
}

export default Balance;
