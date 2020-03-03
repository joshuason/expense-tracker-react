import React from 'react';

const History = props => {
  const { history, handleDelete, handleEdit } = props;

  return (
    <div id="history">
      <h2>History</h2>
      <table>
        <tbody>
          {(history.length)
            ? history.map((historyItem) => {
                const { key, text, amount } = historyItem;
                return (
                  <tr key={key}>
                    {/*<td>{historyItem.key}</td>*/}
                    <td>{text}</td>
                    <td style={rightBorder(amount)}>{amount}</td>
                    <td>
                      <button onClick={() => handleDelete(key)}>
                      x
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(key)}>
                      e
                      </button>
                    </td>
                  </tr>
                );
              })
            : <tr>
                <td>Nothing to show...</td>
              </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

const rightBorder = amount => {
  if (amount > 0) {
    return { borderRight: "3px solid #00ff00" };
  } else if (amount < 0) {
    return { borderRight: "3px solid #ff0000" };
  } else {
    return { borderRight: "3px solid #ffffff" };;
  }
}

export default History;
