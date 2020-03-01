import React, { Component } from 'react';
import './App.css';

import Transactions from './components/Transactions';
import History from './components/History';
import Balance from './components/Balance';
//import ErrorBoundary from './components/ErrorBoundary';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      income: 0,
      expenses: 0,
      history: [],
      form: {
        text: '',
        amount: '',
        isValid: false,
      },
      error: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const newHistory = this.updateHistory();
    const { income, expenses, balance } = this.updateBalance(newHistory);

    if (this.state.form.isValid) {
      this.setState({
        form: {
          text: '',
          amount: '',
          isValid: false,
        },
        history: newHistory,
        income: isValidAmount(income),
        expenses: isValidAmount(expenses),
        balance: isValidAmount(balance),
      });
      console.log('Transaction Added');
    } else {
      console.log('Form is invalid');
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;

    const form = this.state.form;
    (name === 'text')
      ? form.text = value
      : form.amount = value;

    if (!(form.amount === '') && !isValidAmount(form.amount) && (form.amount.length > 2)) {
      console.log('Error: Invalid input:', form.amount, isValidAmount(form.amount));
    }
    form.isValid = isValidAmount(form.amount) !== false;
    (form.text === 'error') && this.setState({ error: 'error', });

    this.setState({
      form
    });
  }

  updateHistory = ({ text, amount } = this.state.form) => {
    const { history } = this.state;

    const newHistory = history.concat([{
      key: history.length,
      text,
      amount: (isValidAmount(amount)) ? isValidAmount(amount) : '',
    }]);
    return newHistory;
  }

  updateBalance = (newHistory) => {
    let income = 0;
    let expenses = 0;

    newHistory.map(item => {
      parseFloat(item.amount) > 0 ? (income += parseFloat(item.amount)) : (expenses += parseFloat(item.amount))
      return item;
    });

    let balance = income + expenses;
    return { income, expenses, balance };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error">
          <h1>Something went wrong. Error: {this.state.error}.</h1>
        </div>
      );
    }

    return (
      <div>
        <h1>Expense Tracker</h1>
        <Balance
          balance={this.state.balance}
          income={this.state.income}
          expenses={this.state.expenses}
        />
        <History
          historyItems={this.state.history}
        />
        <Transactions
          form={this.state.form}
          handleSubmit={this.handleSubmit}
          handleInputChange={this.handleInputChange}
          showAmountError={!this.state.form.isValid}
        />
      </div>
    );
  }
}

export default App;

const isValidAmount = amount => {
  let val = amount.toString();
  if (val.includes('$')) {
    let index = val.indexOf('$');
    if (index > 1 || (index === 1 && val[0] !== '-')) {
      return false;
    }
    val = val.substring(0, index) + val.substring(index + 1, val.length);
  }

  if (Number(val) === parseFloat(val))
    return parseFloat(val).toFixed(2);
  else {
    return false;
  }
}

/*

  TODOS:
    [x] Work on history (23/02/20)
      [x] Add item with *key 0* to history
      [x] Populate history
    [x] Work on balance (24/02/20)
      [x] Work out income
      [x] Work out expenses
    [ ] Finishing touches
      [x] Form verification
        [x] Validate input in amount field (25/02/20)
          [e] Show error on page -- not an alert lol
      [x] Error handling
      [ ] Styling (CSS)
    [ ] Extras ~ [e]
      [e] Show error on page -- not an alert lol
      [ ] Add $ where appropriate
      [ ] After pressing [enter] from the amount field, move the cursor to the text field
      [ ] Validate input in text field
      [ ] Add a delete function to remove items from history
      [ ] Add an edit function to edit an item in history
        - perhaps edit on the fly; ability to click on text, change it to an input, click off, save, update
      [ ] if input is valid, dynamically update balance, income and expenses
      [ ] don't accept input value zero
*/
