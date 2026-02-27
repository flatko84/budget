import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
function CreateTransaction({categories}) {

  const [transaction, setTransaction] = useState({})

  const createTransaction = async (newTransaction) => {
    const response = await fetch("http://localhost:8000/transactions",
      {
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify(newTransaction)
      }
    )
    return response.json()
  }

  const handleChange = (key, value, transaction) => {
    transaction[key] = value
    if (transaction.type === "0" && transaction.amount > 0) {
      transaction.amount = transaction.amount * -1
    }
    setTransaction(transaction)
  }

  const {mutate} = useMutation({mutationFn: createTransaction})

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(transaction)
  }

  return (
    <><form>
      <table>
        <tbody>
        
        
          <tr><td>
        Type:</td><td> <select onChange={(e) => {
          handleChange("type", e.target.value, transaction)
        }}>
            <option value="1">Income</option>
            <option value="0">Expense</option>
        </select>
        </td></tr>
        <tr><td>
        Category:</td><td>
        <select onChange={(e) => {
          handleChange("category_id", e.target.value, transaction)
        }}>
          {
            categories?.map((c) => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })
          }
        </select>
        </td></tr>
        <tr><td>
        Name:</td><td><input type="text" onChange={(e) => {
          handleChange("name", e.target.value, transaction)
        }}/></td></tr>
        <tr><td>
        Amount:</td><td> €<input type="number" onChange={(e) => {
          handleChange("amount", e.target.value, transaction)
        }}/></td></tr>
        <tr><td></td><td>
        <button onClick={handleSubmit}>
          Create transaction
        </button></td></tr>
        
        </tbody>
      </table>
      </form>
    </>
  )
}

export default CreateTransaction