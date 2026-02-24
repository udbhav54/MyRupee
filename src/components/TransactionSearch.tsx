import { useState, useRef } from "react";
import { Search, Upload, Download } from "lucide-react";
import { parse, unparse } from "papaparse";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/stores/useTransactionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TransactionSearchProps {
  transactions: Transaction[];
  addTransaction: (
    transaction: Omit<Transaction, "id" | "userId" | "createdAt">,
  ) => Promise<void>;
  fetchTransactions: () => void;
}

export default function TransactionSearch({
  transactions,
  addTransaction,
  fetchTransactions,
}: TransactionSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [sortKey, setSortKey] = useState<"none" | "date" | "amount">("none");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortKey === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortKey === "amount") {
        return b.amount - a.amount;
      }
      return 0;
    });

  // Export to CSV
  const exportToCsv = () => {
    const csv = unparse({
      fields: ["name", "type", "date", "amount", "tag"],
      data: transactions.map((t) => ({
        name: t.name,
        type: t.type,
        date: t.date,
        amount: t.amount,
        tag: t.tag,
      })),
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully!");
  };

  // Import from CSV
  const importFromCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const data = results.data as any[];
          for (const row of data) {
            if (row.name && row.type && row.date && row.amount && row.tag) {
              await addTransaction({
                name: row.name,
                type: row.type,
                date: row.date,
                amount: parseInt(row.amount, 10),
                tag: row.tag,
              });
            }
          }
          fetchTransactions();
          toast.success("Transactions imported successfully!");
        } catch (error) {
          console.error("Import error:", error);
          toast.error("Failed to import transactions");
        }
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        toast.error("Failed to parse CSV file");
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(value: any) => setTypeFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <RadioGroup
            value={sortKey}
            onValueChange={(value: any) => setSortKey(value)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="sort-none" />
                <Label htmlFor="sort-none" className="cursor-pointer">
                  No Sort
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="sort-date" />
                <Label htmlFor="sort-date" className="cursor-pointer">
                  Date
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amount" id="sort-amount" />
                <Label htmlFor="sort-amount" className="cursor-pointer">
                  Amount
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* Export/Import */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={importFromCsv}
              className="hidden"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">{transaction.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {format(parseISO(transaction.date), "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{transaction.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {transaction.tag}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
