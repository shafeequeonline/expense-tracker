import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.expense.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting expense' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { amount, category, type, description } = body;

        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: {
                amount: parseFloat(amount),
                category,
                type,
                description,
            },
        });

        return NextResponse.json(updatedExpense);
    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json({ error: 'Error updating expense' }, { status: 500 });
    }
}
