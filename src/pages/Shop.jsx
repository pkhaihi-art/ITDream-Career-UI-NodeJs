import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../services/operations/productAPI";

export default function Shop() {
    const [products, setProducts] = useState({
        latestProducts: [],
        bestSellingProducts: [],
        highestDiscountProducts: [],
        mostViewedProducts: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const result = await fetchAllProducts();

            if (result?.latestProducts) {
                setProducts({
                    latestProducts: result.latestProducts || [],
                    bestSellingProducts: result.bestSellingProducts || [],
                    highestDiscountProducts: result.highestDiscountProducts || [],
                    mostViewedProducts: result.mostViewedProducts || [],
                });
            } else {
                setError(result?.message || "Không thể tải sản phẩm");
            }

            setLoading(false);
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-yellow-50 text-lg">
                Đang tải sản phẩm...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-400 text-lg">
                {error}
            </div>
        );
    }

    const renderSection = (title, items) => {
        if (!items?.length) return null;

        return (
            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-richblack-5 mb-4">{title}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((product) =>
                            product?.id ? (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="bg-richblack-800 rounded-xl p-4 shadow hover:shadow-lg transition"
                                >
                                    <img
                                        src={
                                            product.image?.startsWith("http")
                                                ? product.image
                                                : "/fallback.jpg"
                                        }
                                        alt={product.name || "No name"}
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                    <h3 className="text-lg font-semibold mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-richblack-300 line-clamp-2 min-h-[40px]">
                                        {product.description || "Không có mô tả"}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                  <span className="text-yellow-50 font-bold">
                    {product.discountedPrice
                        ? Number(product.discountedPrice).toLocaleString()
                        : "Liên hệ"}
                      ₫
                  </span>
                                        {product.discount > 0 && product.price && (
                                            <span className="line-through text-richblack-500 text-sm">
                      {Number(product.price).toLocaleString()}₫
                    </span>
                                        )}
                                    </div>
                                </Link>
                            ) : null
                    )}
                </div>
            </section>
        );
    };

    return (
        <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-yellow-50 mb-8">Cửa Hàng</h1>

            {renderSection("Sản phẩm mới nhất", products.latestProducts)}
            {renderSection("Bán chạy nhất", products.bestSellingProducts)}
            {renderSection("Giảm giá nhiều nhất", products.highestDiscountProducts)}
            {renderSection("Xem nhiều nhất", products.mostViewedProducts)}
        </div>
    );
}
