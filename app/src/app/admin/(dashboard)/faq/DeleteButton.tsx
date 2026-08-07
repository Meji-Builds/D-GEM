"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteFaqItem } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-bodyfg hover:text-red-700"
      onClick={() => {
        if (confirm("Remove this question?")) {
          start(async () => {
            await deleteFaqItem(id);
            router.refresh();
          });
        }
      }}
    >
      Delete
    </button>
  );
}
