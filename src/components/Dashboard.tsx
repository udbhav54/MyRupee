import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTransactionStore, Transaction } from "@/stores/useTransactionStore";
import Header from "./Header";
import Loader from "./Loader";
import Cards from "./Cards";
import AddIncomeModal from "./AddIncomeModal";
import AddExpenseModal from "./AddExpenseModal";
import NoTransactions from "./NoTransactions";
import TransactionSearch from "./TransactionSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const {
    transactions,
    totalIncome,
    totalExpenses,
    currentBalance,
    setTransactions,
    addTransaction: addTransactionToStore,
    resetBalances,
  } = useTransactionStore();

  const [loading, setLoading] = useState(true);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Fetch transactions in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const transactionsData: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(transactionsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, setTransactions]);

  // Add transaction to Firestore
  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "userId" | "createdAt">,
  ) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transaction,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      addTransactionToStore({
        id: docRef.id,
        ...transaction,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      toast.success(
        `${transaction.type === "income" ? "Income" : "Expense"} added successfully!`,
      );
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  // Process chart data
  const processChartData = () => {
    // Monthly balance data for line chart
    const monthlyData: { [key: string]: { income: number; expenses: number } } =
      {};

    transactions.forEach((transaction) => {
      const month = format(parseISO(transaction.date), "MMM yyyy");
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });

    const balanceData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        balance: data.income - data.expenses,
      }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
      );

    // Spending data by tag for pie chart
    const spendingByTag: { [key: string]: number } = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        spendingByTag[transaction.tag] =
          (spendingByTag[transaction.tag] || 0) + transaction.amount;
      });

    const spendingDataArray = Object.entries(spendingByTag).map(
      ([category, value]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        value,
      }),
    );

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Cards
          currentBalance={currentBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          onAddIncome={() => setIsIncomeModalOpen(true)}
          onAddExpense={() => setIsExpenseModalOpen(true)}
          onReset={resetBalances}
        />

        {transactions.length === 0 ? (
          <NoTransactions />
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Line Chart */}
              {balanceData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Balance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={balanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toLocaleString("en-IN")}`
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="#2970ff"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Pie Chart */}
              {spendingDataArray.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={spendingDataArray}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) =>
                            `${entry.category}: ₹${entry.value.toLocaleString("en-IN")}`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {spendingDataArray.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toLocaleString("en-IN")}`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Transaction Table */}
            <TransactionSearch
              transactions={transactions}
              addTransaction={addTransaction}
              fetchTransactions={() => {}} // Real-time updates via onSnapshot
            />
          </>
        )}
      </main>

      {/* Modals */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onFinish={addTransaction}
      />
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onFinish={addTransaction}
      />
    </div>
  );
}
