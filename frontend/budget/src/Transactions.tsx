import { useState } from 'react'
import Transaction from './Transaction'
import CreateTransaction from './CreateTransaction'
import { useQuery, useMutation } from '@tanstack/react-query'
function Transactions({transactions}) {

const fetchCategories = async () => {
  const categoriesResponse = await fetch('http://localhost:8000/categories')
  if (!categoriesResponse.ok) {
    throw new Error("Error getting categories.")
  }
  return categoriesResponse.json()
}

const processDeleteTransaction = async (transactionId) => {
  const response = await fetch(`http://localhost:8000/transaction/${transactionId}`,{
    method: "DELETE"
  })
  return response.json()
}

const {mutate} = useMutation({mutationFn: processDeleteTransaction})

const handleDeleteTransaction = (e) => {
  mutate(e)
}


  const { data, isLoading } = useQuery({queryKey: ['categories'], queryFn: fetchCategories})
  return (
    <>
    <h2>Create transaction</h2>
    <CreateTransaction categories={data}></CreateTransaction>
      <h2>Transactions list</h2>
      <table><tbody>
      {transactions?.map(transaction => {
        return <Transaction key={transaction.id} transaction={transaction} deleteTransaction={handleDeleteTransaction}></Transaction>
      })}
      </tbody>
      </table>
      
    </>
  )
}

export default Transactions
