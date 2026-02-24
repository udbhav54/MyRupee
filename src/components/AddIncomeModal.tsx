import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const incomeSchema = z.object({
  name: z.string().min(1, "Income name is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  date: z.string().min(1, "Date is required"),
  tag: z.string().min(1, "Please select a category"),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (values: {
    name: string;
    amount: number;
    date: string;
    tag: string;
    type: "income";
  }) => void;
}

export default function AddIncomeModal({
  isOpen,
  onClose,
  onFinish,
}: AddIncomeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const selectedTag = watch("tag");

  const onSubmit = (data: IncomeFormData) => {
    onFinish({
      name: data.name,
      amount: Number(data.amount),
      date: data.date,
      tag: data.tag,
      type: "income",
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="income-name">Income Name</Label>
            <Input
              id="income-name"
              placeholder="Enter income name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-amount">Amount (₹)</Label>
            <Input
              id="income-amount"
              type="number"
              placeholder="Enter amount"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-date">Date</Label>
            <Input id="income-date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-tag">Category</Label>
            <Select
              value={selectedTag}
              onValueChange={(value) => setValue("tag", value)}
            >
              <SelectTrigger id="income-tag">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectContent>
            </Select>
            {errors.tag && (
              <p className="text-sm text-destructive">{errors.tag.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Income
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
