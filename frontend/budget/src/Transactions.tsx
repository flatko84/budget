import { useState } from 'react'
import Transaction from './Transaction'
import CreateTransaction from './CreateTransaction'
import Stats from './Stats'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
function Transactions() {
  const queryClient = useQueryClient();

  const [renderData, setRenderData] = useState({ showCreateTransaction: 0 })

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
    const response = await fetch(`http://localhost:8000/transaction/${transactionId}`, {
      method: "DELETE"
    })
    return response.json()
  }

  const transactionMutation = useMutation({
    mutationFn: processDeleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
    },
  })

  const handleDeleteTransaction = (e) => {
    transactionMutation.mutate(e)
  }

  const handleShowCreateTransaction = () => {
    setRenderData((prev) => {
      const updated = { ...prev };
      updated.showCreateTransaction = renderData?.showCreateTransaction ? 0 : 1
      return updated
    })
  }

  const createTransactionCallback = () => {
    queryClient.invalidateQueries(["transactions"]);
    setRenderData((prev) => {
      const updated = { ...prev };
      updated.showCreateTransaction = 0
      return updated
    })
  }


  const categories = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const transactions = useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions })
  return (
    <>
    <Stats></Stats>
      <button className="mt-20" onClick={handleShowCreateTransaction}>Show/hide Create transaction</button>
      {renderData?.showCreateTransaction ?
        <CreateTransaction categories={categories.data} createTransactionCallback={createTransactionCallback}></CreateTransaction> : ""}
      
      <h2>Transactions list</h2 >
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
