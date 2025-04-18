import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormType } from "./boooking";

type DeliveryAddressProps = {
  form: UseFormReturn<BookingFormType>;
};

export function DeliveryAddress({ form }: DeliveryAddressProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Delivery Address</h2>

      {/* Checkbox for Same Address */}
      {/* <FormField
        control={form.control}
        name="delivery_address.sameAsClientAddress"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Same as Client Address</FormLabel>
            </div>
          </FormItem>
        )}
      /> */}

      {/* Only show the delivery fields if the checkbox is unchecked */}
      {
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="delivery_address.recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.deliveryAddressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address Line 1</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.deliveryAddressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.deliveryCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.deliveryState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.deliveryPincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Pincode</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.deliveryContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number for Delivery</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_address.additionalDeliveryInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Delivery Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional delivery instructions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      }
    </div>
  );
}
