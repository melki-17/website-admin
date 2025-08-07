import db from "@/lib/db"

import { ProductColumn } from "./components/columns"

import { format } from "date-fns"
import { formatter } from "@/lib/utils"
import { ProducClient } from "./components/client"

const ProductsPage = async ({
    params
}: {
    params: Promise<{ storeId: string}>
}) => {
    const {storeId} = await params
    const products = await db.product.findMany({
        where: {
            storeId
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedProducts:ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <ProducClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductsPage