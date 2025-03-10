import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormType } from "./boooking";
type EventDetailsProps = {
  form: UseFormReturn<BookingFormType>;
};

export function EventDetails({ form }: EventDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Event Details</h2>

      {/* Event Details Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="event_details.eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name/Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.eventStartTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Start Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.eventEndTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.venueAddressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Address Line 1</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.venueAddressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.venueCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.venuePincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Pincode</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.numberOfGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests/Participants</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value, 10))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_details.specialRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Special Requirements (e.g., Theme, Props, etc.)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any special requirements"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
