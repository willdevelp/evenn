import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { neon } from "@neondatabase/serverless"
import { getUser } from "@/lib/auth-server"

export default async function AddEvent() {
    const user = await getUser();

    // async function create(formData: FormData){
    //     "use server";

    //     const sql = neon(process.env.DATABASE_URL!);

    //     const name = formData.get("name");
    //     const description = formData.get("description");
    //     const date = formData.get("date");
    //     const type = formData.get("type");
    //     const location = formData.get("location");
    //     const time = formData.get("time");
    //     const price = formData.get("price");
    //     const image = formData.get("image");
    //     const userId = user?.id;

    //     await sql("INSERT INTO event (name, description, date, time, location, price, type, image, userId) VALUES (${name}, ${description}, ${date}, ${time}, ${location}, ${price}, ${type}, ${image}, ${userId})", [name, description, date, time, location, price, type, image, userId]);

    // }
    return (
        <Dialog>
        <form action="">
            <DialogTrigger asChild>
                <Button variant="outline">Ajouter un événement</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un événement</DialogTitle>
                    <DialogDescription>
                        Ajouter un événement
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 px-2 py-2 w-[850px] max-w-full">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="name">Nom de l'événement</Label>
                            <Input type="text" id="name" name="name"/>
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="description">Description de l'événement</Label>
                            <Input type="text" id="description" name="description"/>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="date">Date de l'événement</Label>
                            <Input type="date" id="date" name="date"/>
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="time">Heure de l'événement</Label>
                            <Input type="time" id="time" name="time"/>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="location">Lieu de l'événement</Label>
                            <Input type="text" id="location" name="location"/>
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="price">Prix de l'événement</Label>
                            <Input type="number" id="price" name="price"/>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label>Type de l'évènement</Label>
                            <Select >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="concert">Concert</SelectItem>
                                    <SelectItem value="event">Evénement</SelectItem>
                                    <SelectItem value="mariage">Mariage</SelectItem>
                                    <SelectItem value="anniversaire">Anniversaire</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <Label htmlFor="image">Image de l'événement</Label>
                            {/* <CldUploadWidget 
                                uploadPreset="upload"
                                onSuccess={(result) => {
                                    const url = (result?.info as any)?.secure_url;
                                    const hiddenInput = document.getElementById("image") as HTMLInputElement;
                                    if (hiddenInput) hiddenInput.value = url;
                                }}
                            >
                                {({ open }) => (
                                    <Button type="button" onClick={() => open()}>Ajoutez une image</Button>
                                )}
                            </CldUploadWidget> */}
                            <Input type="file" name="image" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>Annuler</DialogClose>
                    <Button type="submit">Ajouter</Button>
                </DialogFooter>
            </DialogContent>
        </form>
    </Dialog>
    )
}
