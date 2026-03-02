import { useState } from 'react'
import Transaction from './Transaction'
import CreateTransaction from './CreateTransaction'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
function Transactions() {
  const queryClient = useQueryClient();

const fetchCategories = async () => {
  const categoriesResponse = await fetch('http://localhost:8000/categories')
  if (!categoriesResponse.ok) {
    throw new Error("Error getting categories.")
  }
  return categoriesResponse.json()
}

const fetchTransactions = async () => {
  const transactionsResponse = await fetch('http://localhost:8000/transactions')
  if (!transactionsResponse.ok) {
    throw new Error("Error getting transactions.")
  }
  return transactionsResponse.json()
}

const processDeleteTransaction = async (transactionId) => {
  const response = await fetch(`http://localhost:8000/transaction/${transactionId}`,{
    method: "DELETE"
  })
  return response.json()
}

const transactionMutation = useMutation({mutationFn: processDeleteTransaction, 
onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
    },
})

const handleDeleteTransaction = (e) => {
  transactionMutation.mutate(e)
}

const createTransactionCallback = () => {
  queryClient.invalidateQueries(["transactions"]);
}


  const categories = useQuery({queryKey: ['categories'], queryFn: fetchCategories})
  const transactions = useQuery({queryKey: ['transactions'], queryFn: fetchTransactions})
  return (
    <>
    <h2>Create transaction</h2>
    <CreateTransaction categories={categories.data} createTransactionCallback={createTransactionCallback}></CreateTransaction>
      <h2>Transactions list</h2>
      <table><tbody>
      {transactions?.data?.map(transaction => {
        return <Transaction key={transaction.id} transaction={transaction} deleteTransaction={handleDeleteTransaction}></Transaction>
      })}
      </tbody>
      </table>
      
    </>
  )
}

export default Transactions
