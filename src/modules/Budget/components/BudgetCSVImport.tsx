import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Expense } from "../../../utils/types";

interface BudgetCSVImportProps {
  onImport: (expenses: Expense[]) => void;
}

export const BudgetCSVImport: React.FC<BudgetCSVImportProps> = ({
  onImport,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCsvFile(event.target.files[0]);
      setPreviewData([]);
      setError(null);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      throw new Error("Empty CSV file.");
    }

    // Simple heuristic for header: assume first line is header if it contains non-numeric values
    const hasHeader = !/^[\d.,\s-]+$/.test(lines[0]);
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const parsedExpenses: Expense[] = [];

    dataLines.forEach((line, index) => {
      // Basic parsing: split by comma, trim whitespace
      const columns = line.split(",").map((col) => col.trim());

      // Simple heuristic for column mapping: assumes Amount, Description, Date order or similar
      // This is highly simplified and would need robust user mapping in a real app
      let amount = 0;
      let description = `Imported Expense ${index + 1}`;
      let date = new Date().toISOString();

      // Try to find amount (first numeric value)
      const amountIndex = columns.findIndex(
        (col) => !isNaN(parseFloat(col.replace(/[^\d.-]/g, ""))),
      );
      if (amountIndex !== -1) {
        amount = parseFloat(columns[amountIndex].replace(/[^\d.-]/g, ""));
        // Remove amount from columns to use remaining for description
        columns.splice(amountIndex, 1);
      }

      // Try to find a date (first value that looks like a date)
      const dateIndex = columns.findIndex(
        (col) => !isNaN(new Date(col).getTime()),
      );
      if (dateIndex !== -1) {
        date = new Date(columns[dateIndex]).toISOString();
        columns.splice(dateIndex, 1);
      }

      // Remaining columns form the description
      description = columns.join(" ").trim() || description;

      if (isNaN(amount) || amount === 0) {
        console.warn(
          `Skipping line ${index + 1} due to invalid amount: ${line}`,
        );
        return; // Skip invalid lines
      }

      parsedExpenses.push({
        id: `csv-${Date.now()}-${index}`,
        amount: Math.abs(amount), // Assume positive for expenses
        category: "Uncategorized", // Default category, will be auto-categorized later
        description:
          description.length > 100
            ? description.substring(0, 97) + "..."
            : description,
        date: date,
      });
    });
    return parsedExpenses;
  };

  const handleProcessCsv = () => {
    if (!csvFile) {
      setError("Please select a CSV file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const expenses = parseCSV(text);
        setPreviewData(expenses);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV.");
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsText(csvFile);
  };

  const handleConfirmImport = () => {
    onImport(previewData);
    setCsvFile(null);
    setPreviewData([]);
    setError(null);
  };

  return (
    <Card className="p-6 bg-teal-light/50 border border-turquoise/30 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">
        📄 Import Expenses from CSV
      </h3>
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-turquoise/80
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-turquoise file:text-dark-teal
            hover:file:bg-turquoise/80
          "
        />
      </div>
      <Button
        onClick={handleProcessCsv}
        disabled={!csvFile}
        className="w-full mb-4"
      >
        Preview CSV
      </Button>

      {error && <p className="text-red-400 text-sm mb-4">Error: {error}</p>}

      {previewData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-turquoise/20"
        >
          <h4 className="text-lg font-semibold text-white mb-3">
            Preview ({previewData.length} items)
          </h4>
          <div className="max-h-60 overflow-y-auto mb-4 border border-turquoise/10 rounded-lg">
            <table className="min-w-full text-sm text-white/90">
              <thead>
                <tr className="bg-teal-dark/50">
                  <th className="py-2 px-3 text-left">Amount</th>
                  <th className="py-2 px-3 text-left">Description</th>
                  <th className="py-2 px-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((expense) => (
                  <tr
                    key={expense.id}
                    className="odd:bg-teal-light/20 even:bg-teal-light/10"
                  >
                    <td className="py-2 px-3">${expense.amount.toFixed(2)}</td>
                    <td className="py-2 px-3">{expense.description}</td>
                    <td className="py-2 px-3">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={handleConfirmImport} className="w-full">
            Confirm Import
          </Button>
        </motion.div>
      )}
    </Card>
  );
};
