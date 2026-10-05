"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRiddle } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-bodyfg hover:text-red-700"
      onClick={() => {
        if (confirm("Remove this riddle?")) {
          start(async () => {
            await deleteRiddle(id);
            router.refresh();
          });
        }
      }}
    >
      Delete
    </button>
  );
}
