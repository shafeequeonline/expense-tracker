import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(expenses);
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ error: 'Error fetching expenses' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { amount, category, type, description } = body;

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                category,
                type,
                description,
                date: new Date(),
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json({ error: 'Error creating expense' }, { status: 500 });
    }
}
