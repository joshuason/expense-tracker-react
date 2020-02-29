import React from 'react';

const History = props => {
  const history = props.historyItems;

  return (
    <div id="history">
      <h2>History</h2>
      <table>
        <tbody>
          {history.map((historyItem) =>
            <tr key={historyItem.key}>
              <td>{historyItem.key}</td>
              <td>{historyItem.text}</td>
              <td>{historyItem.amount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default History;
