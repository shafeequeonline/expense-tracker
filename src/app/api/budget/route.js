import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const budgets = await prisma.budget.findMany();
        // Convert array to object { category: amount } for frontend compatibility
        const budgetMap = budgets.reduce((acc, curr) => {
            acc[curr.category] = curr.amount;
            return acc;
        }, {});
        return NextResponse.json(budgetMap);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching budgets' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { category, amount } = body;

        const budget = await prisma.budget.upsert({
            where: { category },
            update: { amount: parseFloat(amount) },
            create: {
                category,
                amount: parseFloat(amount)
            },
        });

        return NextResponse.json(budget);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating budget' }, { status: 500 });
    }
}
