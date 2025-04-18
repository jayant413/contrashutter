import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingFormType } from "./boooking";
import Link from "next/link";

type PaymentDetailsProps = {
  form: UseFormReturn<BookingFormType>;
};

export function PaymentDetails({ form }: PaymentDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Payment Details</h2>

      {/* Preferred Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="payment_details.preferredPaymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Credit/Debit Card">
                    Credit/Debit Card
                  </SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Cash on Service">
                    Cash on Service
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Type */}
        <FormField
          control={form.control}
          name="payment_details.paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value="1"
                    // onChange={() => {
                    // form.setValue("payment_details.paymentType", );
                    // }}
                  >
                    Full Payment
                  </SelectItem>
                  <SelectItem
                    value="3"
                    // onChange={() => {
                    // form.setValue("payment_details.paymentType", );
                    // }}
                  >
                    Installments (Advance, 2nd installment, 3rd installment)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <h2 className="text-2xl font-semibold">Terms and Confirmation</h2>
      <FormField
        control={form.control}
        name="payment_details.agreeToTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I have read and agree to the{" "}
                <Link
                  href="/terms-conditions"
                  target="_blank"
                  className="text-primary underline"
                >
                  Terms and Conditions
                </Link>
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="payment_details.confirmBookingDetails"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm that the details provided are accurate to the best of
                my knowledge.
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
