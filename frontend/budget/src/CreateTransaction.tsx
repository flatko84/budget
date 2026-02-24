import { useState } from 'react'
function CreateTransaction({transaction}) {

  return (
    <>
      <div className="card">
        Type: <select>
            <option value="1">Income</option>
            <option value="0">Expense</option>
        </select>
        Category:
        <select>

        </select>
        Name:<input type="text"/>
        Amount: €<input type="number"/>
      </div>
      
    </>
  )
}

export default CreateTransaction