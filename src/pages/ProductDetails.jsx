import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/operations/productAPI";

export default function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            const data = await fetchProductById(productId);
            if (data?.id) {
                setProduct(data);
            }
            setLoading(false);
        };
        loadProduct();
    }, [productId]);

    if (loading) return <div className="text-center py-10 text-white">Đang tải...</div>;
    if (!product) return <div className="text-center py-10 text-red-500">Sản phẩm không tồn tại</div>;

    return (
        <div className="w-full min-h-screen bg-richblack-900 text-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full max-h-[400px] object-cover rounded-xl"
                />
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-richblack-300 mb-4">{product.description}</p>

                    <div className="text-2xl font-bold text-yellow-50 mb-2">
                        {product.discountedPrice.toLocaleString()}₫
                    </div>
                    {product.discount > 0 && (
                        <div className="text-sm line-through text-richblack-500 mb-4">
                            Giá gốc: {Number(product.price).toLocaleString()}₫
                        </div>
                    )}

                    <p className="mb-2">Còn lại: {product.stock} sản phẩm</p>
                    <p className="mb-4">Danh mục: {product.category}</p>

                    <button className="bg-yellow-50 text-black px-6 py-3 rounded-lg hover:bg-yellow-100 transition">
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
}
