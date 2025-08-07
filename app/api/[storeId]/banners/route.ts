
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

        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse("Nama banner perlu di input", {status: 400});
        }
        
        if (!imageUrl) {
            return new NextResponse("Image banner perlu di input", {status: 400});
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

        const banner = await db.banner.create({
            data: {
                label,
                imageUrl,
                storeId,
            },
        });

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log("[BANNERS_POST]", error);
        return new NextResponse('Internal error', {status: 500});
    }
}

export async function GET(req: Request, 
    {params} : {params: Promise<{storeId: string}>}
) {
    try {
        const {storeId} = await params
        if (!(await params).storeId) {
            return new NextResponse("Store id URL dibutuhkan")
        }

        const banner = await db.banner.findMany({
            where: {
                storeId
            }
        });

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log("[BANNERS_GET]", error);
        return new NextResponse('Internal error', {status: 500});
    }
}