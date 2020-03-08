import React, { Component } from 'react';
import './styles/App.css';

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
      editForm: {
        trkey: null,
        text: '',
        amount: '',
        isValid: false,
      },
      nextKey: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

    this.updateHistory = this.updateHistory.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.clearEditForm = this.clearEditForm.bind(this);
  }

  componentDidMount() {
    this.textFocus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { form, editForm } = this.state;
    if ((form.amount !== prevState.form.amount) || (form.text !== prevState.form.text)) {
      const { text, amount } = form;
      this.setState({
        form: {
          ...form,
          isValid: (isValidText(text)) && (isValidAmount(amount)),
        }
      });
    }
    if ((editForm.amount !== prevState.editForm.amount) || editForm.text !== prevState.editForm.text) {
      const { text, amount } = editForm;
      this.setState({
        editForm: {
          ...editForm,
          isValid: (isValidText(text)) && (isValidAmount(amount)),
        }
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { editForm, form } = this.state;


    if (editForm.trkey !== null) {
      const { amount } = editForm;
      // validate editForm inputs
      if (editForm.isValid && parseFloat(amount).toFixed(2) !== parseFloat(0).toFixed(2)) {
        // then update history
        this.updateHistory(editForm.trkey);
        this.clearEditForm();
        this.textFocus();
      }
    } else {
      const { amount, text } = form;
      if (form.isValid && parseFloat(amount).toFixed(2) !== parseFloat(0).toFixed(2)) {
        this.updateHistory();
        this.clearForm();
        this.textFocus();
        console.log('Transaction Added');
      } else {
        // if invalid, show appropriate hint
        (isValidAmount(amount))
          ? (parseFloat(amount).toFixed(2) !== parseFloat(0).toFixed(2))
            ? !(isValidText(text))
              && this.setState({ hint: 'text' })
            : this.setState({ hint: 'zero' })
          : (isValidText(text))
            ? this.setState({ hint: 'amount' })
            : this.setState({ hint: 'text amount' });
      }
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;

    const { editForm, form } = this.state;

    if (editForm.trkey !== null) {
      this.setState({
        editForm: {
          ...editForm,
          [name]: value,
        }
      });
    } else {
      this.setState({
        form: {
          ...form,
          [name]: value,
        }
      });
    }
  }

  handleDelete(key) {
    this.updateHistory(key);
  }

  handleEdit(key) {
    const targetHistoryItem = this.state.history.filter(historyItem =>
      historyItem.key === key)[0]; // filter should only return one object

    this.setState({
      editForm: {
        ...this.state.editForm,
        text: targetHistoryItem.text,
        amount: targetHistoryItem.amount,
        trkey: key,
      },
    });
  }

  textFocus = () => {
    this.ref.current.focus();
  }

  updateHistory(key = null) {
    const { history, nextKey, editForm } = this.state;
    const { text, amount } = this.state.form;

    // if i is valid, return history without historyItem.key === i
    // or return history + new history item
    let history_index = 0;
    const newHistory = (key !== null)
      ? history.filter((historyItem, index) => {
        if (historyItem.key === key) {
          history_index = index;
        }
        return historyItem.key !== key
        })
      : history.concat([{
          key: this.state.nextKey,
          text,
          amount: parseFloat(amount).toFixed(2),
        }]);

    // if editing was enabled, add valid edit to its original position
    // &&-conditional allows deletion whilst editing another item
    if (editForm.trkey !== null && editForm.trkey === key) {
      newHistory.splice(history_index, 0, {
        key: editForm.trkey,
        text: editForm.text,
        amount: parseFloat(editForm.amount).toFixed(2),
      });
    }

    // finally set history state
    this.setState({
      nextKey: (key === null) ? nextKey+1 : nextKey,
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

  clearEditForm() {
    this.setState({
      editForm: {
        trkey: null,
        text: '',
        amount: '',
        isValid: false,
      },
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
          handleDelete={i => this.handleDelete(i)}
          handleEdit={i => this.handleEdit(i)}
          editForm={this.state.editForm}
          handleInputChange={this.handleInputChange}
          handleSubmit={this.handleSubmit}
          clearEditForm={this.clearEditForm}
        />
        {(this.state.editForm.trkey === null)
          && <Transactions
              ref={this.ref}
              form={this.state.form}
              handleSubmit={this.handleSubmit}
              handleInputChange={this.handleInputChange}
              hint={this.state.hint}
            />
        }
      </div>
    );
  }
}

export default App;

const isValidAmount = amount => {
  /*
  if (!amount) return false;
  /*
  let val = amount.toString();
  if (val.includes('$')) {
    let index = val.indexOf('$');
    if (index > 1 || (index === 1 && val[0] !== '-')) {
      return false;
    }
    val = val.substring(0, index) + val.substring(index + 1, val.length);
  }

  if (Number(amount) === parseFloat(amount)) {
    return true;
  } else {
    return false;
  }
  */
  return ((Number(amount) === parseFloat(amount)) ? true : false);
}

const isValidText = text => {
  // if text is empty or just spaces
  return (((!text) || (!text.replace(/ /g, '').length)) ? false : true);
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
      [x] Add an edit function to edit an item in history (06/03/20)
        [x] Validate the edit form
        [x] Fix update history // position is incorrect
        [x] Disable transaction fields and submit during edit mode
        [f] perhaps edit on the fly; ability to click on text, change it to an input, click off, save, update
    [ ] Fork ~[f] - make the td rows editable
      [ ] Remove add new transaction header
      [ ] Just have input boxes at the bottom
      [ ] if input is valid, dynamically update balance, income and expenses

    [ ] BUGS:
      [x] Key duplicates when removing and adding Transactions in history
      [x] When in edit mode, you can delete another object resulting in key duplicates
        - updateHistory was causing unintentional results
      [ ] History throws warning (A component is changing an uncontrolled input of type text to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components)
*/
