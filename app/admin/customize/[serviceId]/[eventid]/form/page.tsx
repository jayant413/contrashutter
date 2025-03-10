"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";
import { toast } from "sonner";
import SectionTitle from "@/components/custom/SectionTitle";

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  component: "input" | "select" | "textarea";
  options?: string[];
}

// Pre-filled data for fields
const initialFields: FormField[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    component: "input",
    options: [],
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    component: "input",
    options: [],
  },
  {
    name: "gender",
    label: "Gender",
    type: "text",
    required: false,
    component: "select",
    options: ["Male", "Female", "Other"],
  },
];

const EventForm = () => {
  const params = useParams();
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [formTitle, setFormTitle] = useState("");
  const [newOption, setNewOption] = useState("");
  const router = useRouter();

  const addField = () => {
    setFields([
      ...fields,
      {
        name: "",
        label: "",
        type: "text",
        required: false,
        component: "input",
        options: [],
      },
    ]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const updateField = (index: number, field: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...field };
    setFields(newFields);
  };

  const addOption = (index: number) => {
    if (!newOption) return;
    const newFields = [...fields];
    if (!newFields[index].options) {
      newFields[index].options = [];
    }
    newFields[index].options?.push(newOption);
    setFields(newFields);
    setNewOption("");
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options?.splice(optionIndex, 1);
    setFields(newFields);
  };

  const saveForm = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/forms`, {
        eventType: params.eventid,
        fields,
        formTitle,
      });
      if (response.status === 200) {
        window.scrollTo(0, 0);
        toast.success("Form saved successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Error saving form");
    }
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/forms/event/${params.eventid}`
        );
        if (response.data.data) {
          setFields(response.data.data.fields);
          setFormTitle(response.data.data.formTitle);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [params.eventid]);

  return (
    <div className="p-6">
      <SectionTitle title="Form Builder" />
      <Button onClick={addField} className="mb-6">
        <Plus className="mr-2 h-4 w-4" /> Add Field
      </Button>

      <div className="space-y-4">
        <Input
          placeholder="Form Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        {fields.map((field, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <Input
                  placeholder="Field Name"
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                />
                <Input
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) =>
                    updateField(index, { label: e.target.value })
                  }
                />
                <Select
                  value={field.component}
                  onValueChange={(value: "input" | "select" | "textarea") =>
                    updateField(index, { component: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select component type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="input">Input</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                  </SelectContent>
                </Select>

                {field.component === "input" && (
                  <Select
                    value={field.type}
                    onValueChange={(value) =>
                      updateField(index, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Phone</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${index}`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      updateField(index, { required: checked as boolean })
                    }
                  />
                  <label htmlFor={`required-${index}`}>Required</label>
                </div>

                {field.component === "select" && (
                  <div className="col-span-4">
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                      />
                      <Button onClick={() => addOption(index)}>Add</Button>
                    </div>
                    <div className="space-y-2">
                      {field.options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <span>{option}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOption(index, optionIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="destructive"
                  onClick={() => removeField(index)}
                  className="absolute right-0 top-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={saveForm} className="mt-6">
        Save Form
      </Button>
    </div>
  );
};

export default EventForm;
