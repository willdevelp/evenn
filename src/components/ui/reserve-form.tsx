"use client";

import { useReserve } from "@/context/ReserveContext";
import { useRouter } from "next/navigation";
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Select } from '@/src/components/ui/select'
import { SelectContent } from '@/src/components/ui/select'
import { SelectItem } from '@/src/components/ui/select'
import { SelectTrigger } from '@/src/components/ui/select'
import { SelectValue } from '@/src/components/ui/select'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'


type EventData = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  place: number;
  price: number;
  prices?: number[]; // Added since your API returns this
};

export default function ReserveForm({ data }: { data: EventData }) {

    const router = useRouter();
    const { setReserve } = useReserve();

    const handleReserve = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        console.log(event.currentTarget);

        try {
            const formData = new FormData(event.currentTarget);
            const res = await fetch(`/api/reserves`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error("Failed to create reserve");
            }
            const response = await res.json();
            setReserve(response);
            // router.push("/dashboard/checkout");
            router.push("/checkout");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
          <DialogTrigger asChild>
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
              {"Réserver"}
            </button>
          </DialogTrigger>
      
          <DialogContent>
            <form onSubmit={handleReserve} className="space-y-3">
              <DialogHeader>
                <DialogTitle>{"Réserver cet évènement"}</DialogTitle>
                <DialogDescription>
                  {"Veuillez remplir le formulaire ci-dessous pour réserver cet évènement"}
                </DialogDescription>
              </DialogHeader>
      
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>{"Nom de l'évènement"}</Label>
                  <Input type="text" value={data.title} name="title" readOnly />
                </div>
      
                <div className="space-y-2">
                  <Label>Prix</Label>
                  <Select name="price">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un prix" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.prices?.map((price) => (
                        <SelectItem key={price} value={price.toString()}>
                          {price} FCFA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
      
                <div className="space-y-2">
                  <Label>Nombre de billets</Label>
                  <Input type="number" name="quantity" min="1" />
                </div>
              </div>
      
              <DialogFooter>
                <DialogClose>Annuler</DialogClose>
                <Button type="submit">{"Réserver"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </>
    );
}