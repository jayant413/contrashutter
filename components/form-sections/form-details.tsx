"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingFormType } from "./boooking";

interface FormDetailsProps {
  form: UseFormReturn<BookingFormType>;
  formFields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    component: "input" | "select" | "textarea";
    options?: string[];
  }>;
  formTitle: string;
}

export function FormDetails({ form, formFields, formTitle }: FormDetailsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-3">
        <h1 className="text-2xl font-medium mb-6 capitalize">{formTitle}</h1>
      </div>
      {formFields.length > 0 &&
        formFields.map((field, index) => {
          if (field.component === "input") {
            return (
              <FormField
                key={index}
                control={form.control}
                name={`form_details.${field.name}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.component === "input" && (
                        <Input
                          type={field.type}
                          {...formField}
                          required={field.required}
                          placeholder={field.label}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          } else if (field.component === "textarea") {
            return (
              <FormField
                key={index}
                control={form.control}
                name={`form_details.${field.name}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.component === "textarea" && (
                        <Textarea
                          {...formField}
                          required={field.required}
                          placeholder={field.label}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          } else if (field.component === "select") {
            return (
              <FormField
                key={index}
                control={form.control}
                name={`form_details.${field.name}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.component === "select" && (
                        <Select
                          onValueChange={formField.onChange}
                          defaultValue={formField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={field.label} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option, optionIndex) => (
                              <SelectItem key={optionIndex} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
        })}
    </div>
  );
}
