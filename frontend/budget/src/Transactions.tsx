import { useState } from 'react'
import Transaction from './Transaction'
import CreateTransaction from './CreateTransaction'


function Transactions({transactions}) {

  return (
    <>
    <h2>Create transaction</h2>
    <CreateTransaction></CreateTransaction>
      <h2>Transactions list</h2>
      {transactions?.map(transaction => {
        return <Transaction key={transaction.id} transaction={transaction}></Transaction>
      })}
      
      
    </>
  )
}

export default Transactions
