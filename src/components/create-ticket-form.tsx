"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "./ui/switch";

type Props = {
  events: {
    id: number;
    name: string;
    date: Date;
  }[];
};

const FormSchema = z
  .object({
    event: z
      .string({ required_error: "Vyber prosím event ticketu." })
      .min(1, "Event nemôže byť prázdny."),
    section: z.string().optional().or(z.literal("")),
    row: z.string().optional().or(z.literal("")),
    seatFrom: z
      .string({ required_error: "Napíš prosím sedadlo od." })
      .regex(/^\d+(\.\d+)?$/, "Sedadlo od musí byť číslo.")
      .optional()
      .or(z.literal("")),
    seatTo: z
      .string({ required_error: "Napíš prosím sedadlo do." })
      .regex(/^\d+(\.\d+)?$/, "Sedadlo od musí byť číslo.")
      .optional()
      .or(z.literal("")),
    price: z
      .string({ required_error: "Napíš prosím cenu." })
      .min(1, "Cena nemôže byť prázdna.")
      .regex(/^\d+(\.\d+)?$/, "Cena musí byť číslo."),
    type: z.boolean().default(false),
    note: z
      .string()
      .min(1, "Vyber prosím typ stánia.")
      .optional()
      .or(z.literal("")),
    count: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Počet lístkov musí byť číslo.")
      .min(1, "Počet kusov nemôže byť menší ako 1.")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => {
    if (!data.type) {
      return data.section && data.row && data.seatFrom && data.seatTo;
    }
    return true;
  }, "Sekcia, Rad a Sedadlo sú povinné pre sedenie.")
  .refine((data) => {
    if (data.type) {
      return data.note && data.count;
    }
    return true;
  }, "Typ stánia a počet kusov sú povinné pre stánie.");

export default function CreateTicketForm({ events }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      event: "",
      section: "",
      row: "",
      price: "",
      type: false,
      note: "",
      count: "",
      seatFrom: "",
      seatTo: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { event, price, seatFrom, seatTo, row, section, type, note, count } =
      data;
    try {
      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Number(price),
          seatFrom: Number(seatFrom),
          seatTo: Number(seatTo),
          row: Number(row),
          section: Number(section),
          eventId: Number(event),
          type,
          note,
          count: Number(count),
        }),
      });

      if (!res.ok) throw new Error();

      form.reset();
      toast.success("Ticket úspešne vytvorený.");
      router.push("/me");
    } catch (error) {
      toast.error("Bol problém s vytvorením ticketu.");
      console.log(error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pridaj svoj ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                name="event"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyber event ticketu" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem
                            value={`${event.id}`}
                            key={event.id}
                            className="font-bold"
                          >
                            {event.name} ·
                            <span className="font-normal">
                              {new Date(event.date).toLocaleDateString("sk-sk")}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stánie</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => {
                        form.resetField("row");
                        form.resetField("section");
                        form.resetField("seatFrom");
                        form.resetField("seatTo");
                        field.onChange(e);
                      }}
                    />
                  </FormItem>
                )}
              />
              {form.watch("type") ? (
                <FormField
                  name="note"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ Stánia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vyber typ stánia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stánie pri pódiu">
                            Stánie pri pódiu
                          </SelectItem>
                          <SelectItem value="Stánie">Stánie</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    name="section"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sekcia</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="row"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rad</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="seatFrom"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sedadlo od</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="seatTo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sedadlo do (vrátane)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {form.watch("type") && (
                <FormField
                  name="count"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Počet kusov</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} className="pr-10" />{" "}
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            ks
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cena</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} className="pr-10" />{" "}
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                          €
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting
                  ? "Pridáva sa..."
                  : "Pridaj Ticket"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
