
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, 
    {params} : {params: Promise<{storeId: string}>}
) {
    try {
        const { userId } = await auth();
        const { storeId } = await params
        

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const body = await req.json();

        const { name, price, categoryId, images, isFeatured, isArchived } = body;

        if (!name) {
            return new NextResponse("Nama perlu di input", {status: 400});
        }
        
        if (!images || !images.length) {
            return new NextResponse("Image perlu di input", {status: 400});
        }

        if (!price) {
            return new NextResponse("Harga perlu di input", {status: 400});
        }

        if (!categoryId) {
            return new NextResponse("Kategori perlu di input", {status: 400});
        }

        if (!(await params).storeId) {
            return new NextResponse("Store id URL dibutuhkan")
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const product = await db.product.create({
            data: {
                name,
                price,
                categoryId,
                isFeatured,
                isArchived,
                storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            },
        });

        return NextResponse.json(product);
        
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse('Internal error', {status: 500});
    }
}

export async function GET(req: Request, 
    {params} : {params: Promise<{storeId: string}>}
) {
    try {

        const { searchParams } = new URL (req.url);
        const categoryId = searchParams.get("categoryId") || undefined
        const isFeatured = searchParams.get("isFeatured")

        const {storeId} = await params
        if (!(await params).storeId) {
            return new NextResponse("Store id URL dibutuhkan")
        }

        const products = await db.product.findMany({
            where: {
                storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
        
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse('Internal error', {status: 500});
    }
}