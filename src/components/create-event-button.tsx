"use client";

import React from "react";
import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";

const FormSchema = z.object({
  name: z
    .string({ required_error: "Napíš prosím meno eventu." })
    .min(1, "Meno eventu nemôže byť prázdne."),
  date: z
    .string({ required_error: "Napíš prosím dátum eventu." })
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Nesprávny format dátumu."
    ),
});

export default function CreateEventButton() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      date: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { date, name } = data;

    const [day, month, year] = date.split("/").map(Number);
    const newDate = new Date(Date.UTC(year, month - 1, day));

    const isoDateTime = newDate.toISOString();

    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          date: isoDateTime,
        }),
      });

      if (!res.ok) throw new Error();

      form.reset();
      toast.success("Event úspešne vytvorený.");
      window.location.reload();
    } catch (error) {
      toast.error("Bol problém s vytvorením eventu.");
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-6">
          <SquarePen />
          Vytvoriť event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nový event</DialogTitle>
          <DialogDescription>Vytvor nový event.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meno eventu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dátum eventu</FormLabel>
                  <FormControl>
                    <Input placeholder="DD/MM/YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Vytvára sa..." : "Vytvoriť Event"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
