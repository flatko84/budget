import { useState } from 'react'
function Transaction({transaction, deleteTransaction}) {

    const transactionColor = transaction.amount < 0 ? 'red' : 'green'
    const amount = (amount) => {
      if (amount < 0) {
        amount = amount*-1
      }
      return amount
    }

  return (
    <>
      <tr><td className={transactionColor}>
        {transaction.name}: €{amount(transaction.amount)}</td><td style={{ width: "50px" }}>{transaction.category.name}</td><td style={{ width: "50px" }}><button data-id={transaction.id} onClick={(e) => {e.preventDefault; deleteTransaction(e.target.dataset.id)}}>Delete</button></td>
      </tr>
      
    </>
  )
}

export default Transaction
