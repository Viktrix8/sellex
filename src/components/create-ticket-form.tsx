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
  }[];
};

const FormSchema = z
  .object({
    event: z
      .string({ required_error: "Vyber prosím event ticketu." })
      .min(1, "Event nemôže byť prázdny."),
    section: z.string({ required_error: "Napíš prosím sekciu." }).optional(),
    row: z.string({ required_error: "Napíš prosím radu." }).optional(),
    seat: z.string({ required_error: "Napíš prosím sedadlo." }).optional(),
    price: z
      .string({ required_error: "Napíš prosím cenu." })
      .min(1, "Cena nemôže byť prázdna.")
      .regex(/^\d+(\.\d+)?$/, "Cena musí byť číslo."),
    type: z.boolean().default(false),
  })
  .refine((data) => {
    if (!data.type) {
      return data.section && data.row && data.seat;
    }
    return true;
  }, "Sekcia, Rad a Sedadlo sú povinné pre sedenie.");

export default function CreateTicketForm({ events }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      event: "",
      section: "",
      row: "",
      seat: "",
      price: "",
      type: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { event, price, seat, row, section, type } = data;

    try {
      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Number(price),
          seat: Number(seat),
          row: Number(row),
          section: Number(section),
          eventId: Number(event),
          type,
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
                          <SelectItem value={`${event.id}`} key={event.id}>
                            {event.name}
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
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
              {!form.watch("type") && (
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
                    name="seat"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sedadlo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
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
