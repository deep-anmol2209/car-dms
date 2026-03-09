import { NextResponse } from "next/server";
import { getCustomerById, updateCustomer, deleteCustomerById  } from "@/lib/actions/customer";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const customer = await getCustomerById(params.id);
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}

export async function DELETE(request:Request,{ params }: {params: {id: string}}) {
    try {
        const deleteCustomer= deleteCustomerById(params.id)
        return NextResponse.json(deleteCustomer)
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}

export async function PUT(request: Request, {params}: {params: {id: string}}){
    try {
        const customer = await updateCustomer(params.id, await request.json());
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
}