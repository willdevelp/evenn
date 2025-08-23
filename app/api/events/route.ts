import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({
        ok:true
    });
}

export async function POST(request: NextRequest){
    const formData = await request.formData();

    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        date: formData.get("date"),
        time: formData.get("time"),
        location: formData.get("location"),
        price: formData.get("price"),
        type: formData.get("type"),
        image: formData.get("image"),
    }

    console.log(data);
    return NextResponse.json({
        json: data,
    });

}