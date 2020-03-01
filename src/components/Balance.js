import React from 'react';

const Balance = props => {
  return (
    <div id="balance">
      <p id="bal">Your balance: {props.balance}</p>
      <p>Income: {props.income}</p>
      <p>Expenses: {props.expenses}</p>
    </div>
  )
}

export default Balance;
