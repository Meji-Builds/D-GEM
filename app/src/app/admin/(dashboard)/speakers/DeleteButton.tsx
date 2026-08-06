"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSpeaker } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-bodyfg hover:text-red-700"
      onClick={() => {
        if (confirm("Delete this speaker?")) {
          start(async () => {
            await deleteSpeaker(id);
            router.refresh();
          });
        }
      }}
    >
      Delete
    </button>
  );
}
