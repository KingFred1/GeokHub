"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Icons } from "../Icons";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type NewsletterFormProps = {
  variant?: string;
  title?: string;
  description?: string;
};

export function NewsletterForm({}: NewsletterFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("You've been subscribed to our newsletter!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Join Our Newsletter</h3>
        <p className="text-sm text-muted-foreground">
          Get the latest posts delivered right to your inbox.
        </p>
      </div>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex gap-2"
      >
        <Input
          type="email"
          placeholder="Your email"
          className="flex-1"
          {...form.register("email")}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Subscribe
        </Button>
      </form>
      {form.formState.errors.email && (
        <p className="text-sm text-red-500">
          {form.formState.errors.email.message}
        </p>
      )}
    </div>
  );
}