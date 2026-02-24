import { useState } from 'react'
function Transaction({transaction}) {

    const transactionColor = transaction.amount < 0 ? 'red' : 'green'
  return (
    <>
      <div className={"card " + transactionColor}>
        {transaction.name} - €{transaction.amount}
      </div>
      
    </>
  )
}

export default Transaction
