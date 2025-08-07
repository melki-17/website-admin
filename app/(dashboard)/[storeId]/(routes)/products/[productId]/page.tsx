import db from "@/lib/db"
import { ProductForm } from "./components/product-form"

const ProductPage =  async ({
    params
}: {
    params: Promise<{productId: string, storeId: string}>
}) => {
    const {productId, storeId} = await params
    const product = await db.product.findUnique({
        where: {
            id: productId
        },
        include: {
            images: true,
        },
    })

    const categories = await db.category.findMany({
        where: {
                storeId
        }
    })
    const serializedProduct = product ? JSON.parse(JSON.stringify(product)) : null
    const serializedCategories = JSON.parse(JSON.stringify(categories))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm initialData={serializedProduct} categories={serializedCategories} />
            </div>
        </div>
    )
}
export default ProductPage