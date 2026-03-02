import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

function CreateTransaction({ categories, createTransactionCallback }) {
  const [transaction, setTransaction] = useState({});

  const createTransaction = async (newTransaction) => {
    const response = await fetch("http://localhost:8000/transactions", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(newTransaction),
    });
    createTransactionCallback()
    return response.json();
  };

  const handleChange = (key, value) => {
    setTransaction((prev) => {
      const updated = { ...prev, [key]: value };

      // Normalize negative amount for expenses
      if (updated.type === "0" && updated.amount > 0) {
        updated.amount = updated.amount * -1;
      }

      return updated;
    });
  };

  const { mutate } = useMutation({ mutationFn: createTransaction });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(transaction);
  };

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td>Type:</td>
            <td>
              <select
                value={transaction.type || ""}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="">-- choose --</option>
                <option value="1">Income</option>
                <option value="0">Expense</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Category:</td>
            <td>
              <select
                value={transaction.category_id || ""}
                onChange={(e) => handleChange("category_id", e.target.value)}
              >
                {categories
                  ?.filter((c) => c.transaction_type == transaction.type)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </td>
          </tr>

          <tr>
            <td>Name:</td>
            <td>
              <input
                type="text"
                value={transaction.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>Amount:</td>
            <td>
              €
              <input
                type="number"
                value={Math.abs(transaction.amount) || ""}
                onChange={(e) =>
                  handleChange("amount", Number(e.target.value))
                }
              />
            </td>
          </tr>

          <tr>
            <td />
            <td>
              <button type="submit">Create transaction</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

export default CreateTransaction;
``