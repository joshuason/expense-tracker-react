import React from 'react';

const Transactions = React.forwardRef((props, ref) => {
  const { form, handleSubmit, handleInputChange, hint } = props;
  const { amount, text } = form;

  return (
    <div id="transactions">
      <h2>New transaction</h2>
      <form onSubmit={handleSubmit}>
        <label>Text
          <input
            ref={ref}
            type="text"
            name="text"
            value={text}
            placeholder="enter text..."
            onChange={handleInputChange}
          />
          {(hint.includes('text')) && <span className="hint">Invalid input</span>}
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
          {(hint.includes('amount')) && <span className="hint">Invalid amount</span>}
        </label>
        <input
          type="submit"
          value="Add"
        />
      </form>
      {
        (hint.includes('zero'))
          && <span className="hint">Value of 0 is a bit redundant,
          don't you think?</span>
      }
    </div>
  )

});
/*
const inStyleError = {
  border: "red solid 2px",
}
*/
export default Transactions;
