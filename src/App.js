import React, { Component } from 'react';
import './App.css';

import Transactions from './components/Transactions';
import History from './components/History';
import Balance from './components/Balance';
//import ErrorBoundary from './components/ErrorBoundary';

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();

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
      hint: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

    this.updateHistory = this.updateHistory.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  componentDidMount() {
    this.textFocus();
  }

  handleSubmit(event) {
    event.preventDefault();
    const { amount, text } = this.state.form;

    if (this.state.form.isValid) {
      this.updateHistory();
      this.clearForm();
      this.textFocus();
      console.log('Transaction Added');
    } else {
      (isValidAmount(amount))
        ? (isValidAmount(amount) !== parseFloat(0).toFixed(2))
          ? !(isValidText(text))
            && this.setState({ hint: 'text' })
          : this.setState({ hint: 'zero' })
        : (isValidText(text))
          ? this.setState({ hint: 'amount' })
          : this.setState({ hint: 'text amount' });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;

    const form = this.state.form;
    (name === 'text')
      ? form.text = value
      : form.amount = value;

    form.isValid = (isValidAmount(form.amount))
      && (isValidAmount(form.amount) !== parseFloat(0).toFixed(2))
      && (isValidText(form.text));
    (form.text === 'error') && this.setState({ error: 'error', });

    this.setState({
      form,
    });
  }

  handleDelete(i) {
    // const { history } = this.state;
    //const newHistory = history.filter((historyItem) => historyItem.key !== i);
    // this.setState({ history: history.filter((historyItem) => historyItem.key !== i) },
    //   this.updateBalance);
    this.updateHistory(i);
  }

  handleEdit(i) {
    console.log(`Editing ${i}`);
  }

  textFocus = () => {
    this.ref.current.focus();
  }

  updateHistory(i = null) {
    const { history } = this.state;
    const { text, amount } = this.state.form;
    console.log(i);
    const newHistory = (i !== null)
      ? history.filter((historyItem) => historyItem.key !== i)
      : history.concat([{
          key: history.length,
          text: isValidText(text),
          amount: isValidAmount(amount),
        }]);
    this.setState({
      history: newHistory,
    },this.updateBalance);
  }

  updateBalance() {
    const { history } = this.state;
    let income = 0;
    let expenses = 0;

    history.map(item => {
      parseFloat(item.amount) > 0 ? (income += parseFloat(item.amount)) : (expenses += parseFloat(item.amount))
      return item;
    });

    let balance = income + expenses;
    this.setState({
      income: parseFloat(income).toFixed(2),
      expenses: parseFloat(expenses).toFixed(2),
      balance: parseFloat(balance).toFixed(2),
    });
  }

  clearForm() {
    this.setState({
      form: {
        text: '',
        amount: '',
        isValid: false,
      },
      hint: '',
    });
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
          history={this.state.history}
          handleDelete={(i) => this.handleDelete(i)}
          handleEdit={i => this.handleEdit(i)}
        />
        <Transactions
          ref={this.ref}
          form={this.state.form}
          handleSubmit={this.handleSubmit}
          handleInputChange={this.handleInputChange}
          hint={this.state.hint}
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

const isValidText = text => {
  // if text is empty or just spaces
  if ((!text) || (!text.replace(/ /g, '').length)) return false;
  return text;
}
/*

  TODOS:
    [x] Work on history (23/02/20)
      [x] Add item with *key 0* to history
      [x] Populate history
    [x] Work on balance (24/02/20)
      [x] Work out income
      [x] Work out expenses
    [x] Finishing touches
      [x] Form verification
        [x] Validate input in amount field (25/02/20)
          [e] Show error on page -- not an alert lol
      [x] Error handling
      [x] Styling (CSS) (02/03/20)
        [-] Make it responsive
    [ ] Extras ~[e]
      [x] Show error on page -- not an alert lol
      [x] Validate input in text field (03/03/20)
      [x] Show hint if input is not valid and form submit attempted (03/03/20)
        [ ] Make button shake to indicate invalid input and highlight
      [.] Add $ where appropriate
      [x] don't accept input value zero (03/03/20)
      [x] After pressing [enter] from the amount field, move the cursor to the text field (04/03/20)
      [x] Add a delete function to remove items from history (04/03/20)
      [ ] Add an edit function to edit an item in history
        [f] perhaps edit on the fly; ability to click on text, change it to an input, click off, save, update
    [ ] Fork ~[f] - make the td rows editable
      [ ] Remove add new transaction header
      [ ] Just have input boxes at the bottom
      [ ] if input is valid, dynamically update balance, income and expenses
*/
