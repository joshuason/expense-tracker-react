import React from 'react';

const Transactions = props => {
  const { form, handleSubmit, handleInputChange, showAmountError } = props;
  const { amount, text } = form;

  return (
    <div id="transactions">
      <h2>Add new transaction</h2>
      <form onSubmit={handleSubmit}>
        <label>Text
          <input
            type="text"
            name="text"
            value={text}
            placeholder="enter text..."
            onChange={handleInputChange}
          />
        </label>
        <label>Amount
          <input
            type="text"
            name="amount"
            value={amount}
            placeholder="enter amount..."
            onChange={handleInputChange}
//            style={(showAmountError) ? inStyleError : null}
          />
        </label>
        <input
          type="submit"
          value="Add"
          disabled={(showAmountError)}
        />
      </form>
    </div>
  )

}
/*
const inStyleError = {
  border: "red solid 2px",
}
*/
export default Transactions;
