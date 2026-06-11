
import { NextRequest, NextResponse } from "next/server"
import { getProductsPicture } from "@/server/services/productService";



export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const producto = await getProductsPicture(Number(id))

    if (!producto?.fotoproducto) {
        return new NextResponse(null, { status: 404 })
    }

    return new NextResponse(Buffer.from(producto.fotoproducto), {
        headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=86400"
        }
    })
}