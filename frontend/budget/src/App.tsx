import { useState } from 'react'
import './App.css'
import Transactions from './Transactions'
import { useQuery, useMutation } from '@tanstack/react-query'

const fetchTransactions = async () => {
  const transactionsResponse = await fetch('http://localhost:8000/transactions')
  if (!transactionsResponse.ok) {
    throw new Error("Error getting transactions.")
  }
  return transactionsResponse.json()
}

function App() {
  const { data, isLoading } = useQuery({queryKey: ['transactions'], queryFn: fetchTransactions})
  if (isLoading) {
    return "Loading.........."
  }
  return (
    <>
      <h1>Budget v1.0</h1>
      <div className="card">
        
        <Transactions transactions={data}>

        </Transactions>
      </div>
    </>
  )
}

export default App
