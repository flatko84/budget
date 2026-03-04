import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from "react";


function Stats() {

    const [statsForm, setStatsForm] = useState({})

    const handleChange = (key, value) => {
    setStatsForm((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

    const fetchStats = async () => {
        const url = new URL('/stats', 'http://localhost:8000')
        url.search = new URLSearchParams(statsForm)
        const statsResponse = await fetch(url)
        if (!statsResponse.ok) {
            throw new Error("Error getting stats.")
        }
        return statsResponse.json()
    }

    const stats = useQuery({ queryKey: ['stats', statsForm], queryFn: fetchStats })

    return (
        <>
            <h2>Statistics</h2>
            <table>
                <thead></thead>
                <tbody>
                    <tr><td>From:</td><td><input type="date" value={statsForm.from_date} onChange={(e) => handleChange("from_date", e.target.value)}/></td></tr>
                    <tr><td>To:</td><td><input type="date" value={statsForm.to_date} onChange={(e) => handleChange("to_date", e.target.value)}/></td></tr>
                    <tr><td>Type:</td><td><select onChange={(e) => handleChange("type", e.target.value)} value={statsForm.type}>
                        <option value="all">Total balance</option>
                        <option value="expence">Expences</option>
                        <option value="income">Incomes</option>
                    </select></td></tr>
                    <tr><td>Result:</td><td>{stats.data}</td></tr>
                </tbody>
            </table>
        </>
    )
}

export default Stats