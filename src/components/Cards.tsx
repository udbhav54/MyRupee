import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CardsProps {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  onAddIncome: () => void;
  onAddExpense: () => void;
  onReset: () => void;
}

export default function Cards({
  currentBalance,
  totalIncome,
  totalExpenses,
  onAddIncome,
  onAddExpense,
  onReset,
}: CardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Current Balance Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold mb-4">
            ₹{currentBalance.toLocaleString("en-IN")}
          </p>
          <Button onClick={onReset} variant="outline" className="w-full">
            Reset Balance
          </Button>
        </CardContent>
      </Card>

      {/* Total Income Card */}
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600 mb-4">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
          <Button
            onClick={onAddIncome}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Add Income
          </Button>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600 mb-4">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
          <Button
            onClick={onAddExpense}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Add Expense
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
