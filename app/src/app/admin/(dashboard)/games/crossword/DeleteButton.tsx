"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCrosswordWord } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-bodyfg hover:text-red-700"
      onClick={() => {
        if (confirm("Remove this word? You'll need to regenerate the layout afterwards.")) {
          start(async () => {
            await deleteCrosswordWord(id);
            router.refresh();
          });
        }
      }}
    >
      Delete
    </button>
  );
}
