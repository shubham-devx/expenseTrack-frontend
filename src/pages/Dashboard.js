import { useEffect, useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState("");
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const navigate = useNavigate();

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      navigate("/");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await api.post("/auth/logout");
    navigate("/");
  };

  // ================= REFRESH =================
  const refreshData = async () => {
    await fetchUser();
    await fetchSummary();
    await fetchExpenses();
    setBudget("");
    setAmount("");
  };

  // ================= BUDGET =================
  const setMonthlyBudget = async () => {
    await api.post("/budget/set", {
      month: selectedMonth,
      year: selectedYear,
      amount: Number(budget)
    });
    fetchSummary();
  };

  // ================= EXPENSE =================
  const addExpense = async () => {
    await api.post("/expense/add", {
      title: "Expense",
      amount: Number(amount)
    });
    setAmount("");
    fetchSummary();
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expense/delete/${id}`);
    fetchSummary();
    fetchExpenses();
  };

  // ================= FETCH DATA =================
  const fetchSummary = useCallback(async () => {
  try {
    const res = await api.get(
      `/expense/summary?month=${selectedMonth}&year=${selectedYear}`
    );
    setSummary(res.data);
  } catch (err) {
    console.log(err);
  }
}, [selectedMonth, selectedYear]);

const fetchExpenses = useCallback(async () => {
  try {
    const res = await api.get(
      `/expense/list?month=${selectedMonth}&year=${selectedYear}`
    );
    setExpenses(res.data);
  } catch (err) {
    console.log(err);
  }
}, [selectedMonth, selectedYear]);

  const getColor = () => {
    if (!summary) return "green";
    const percent = Number(summary.percentage);
    if (percent >= 90) return "red";
    if (percent >= 80) return "orange";
    if (percent >= 70) return "yellow";
    return "green";
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h3>Expense Tracker</h3>

        <div style={styles.navRight}>
          {user && (
            <span style={{ marginRight: "15px" }}>
              {user.email}
            </span>
          )}

          <button
            style={styles.refreshBtn}
            onClick={refreshData}
          >
            Refresh
          </button>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* HISTORY SELECT */}
        <div style={styles.card}>
          <h3>View History</h3>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={styles.input}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Month {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button} onClick={refreshData}>
            View
          </button>
        </div>

        {/* BUDGET */}
        <div style={styles.card}>
          <h3>Set Budget</h3>
          <input
            style={styles.input}
            placeholder="Budget Amount"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <button style={styles.button} onClick={setMonthlyBudget}>
            Set Budget
          </button>
        </div>

        {/* ADD EXPENSE */}
        <div style={styles.card}>
          <h3>Add Expense</h3>
          <input
            style={styles.input}
            placeholder="Expense Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button style={styles.button} onClick={addExpense}>
            Add Expense
          </button>
        </div>

        {/* SUMMARY */}
        {summary && (
          <div style={styles.card}>
            <h3>Summary</h3>
            <p>Total Spent: ₹{summary.totalSpent}</p>
            <p>Budget: ₹{summary.budget}</p>
            <p>Remaining: ₹{summary.remaining}</p>
            <strong>{summary.warning}</strong>

            <div style={styles.progressBar}>
              <div
                style={{
                  width: `${summary.percentage}%`,
                  background: getColor(),
                  height: "100%"
                }}
              ></div>
            </div>
          </div>
        )}

        {/* EXPENSE LIST */}
        {expenses.length > 0 && (
          <div style={styles.card}>
            <h3>Expense History</h3>
            {expenses.map((exp) => (
              <div key={exp._id} style={styles.row}>
                <span>₹{exp.amount}</span>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteExpense(exp._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8f9fc"
  },
  navbar: {
    background: "#4e73df",
    color: "white",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  },
  refreshBtn: {
    background: "#1cc88a",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer"
  },
  logoutBtn: {
    background: "red",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  content: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "10px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    background: "#4e73df",
    color: "white",
    cursor: "pointer"
  },
  progressBar: {
    width: "100%",
    height: "20px",
    background: "#ddd",
    borderRadius: "10px",
    marginTop: "10px",
    overflow: "hidden"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  deleteBtn: {
    background: "red",
    border: "none",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Dashboard;