import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="bg-richblack-800 rounded-xl p-4 shadow hover:shadow-lg transition"
        >
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-richblack-300 line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center gap-2">
        <span className="text-yellow-50 font-bold">
          {product.discountedPrice.toLocaleString()}₫
        </span>
                {product.discount > 0 && (
                    <span className="line-through text-richblack-500 text-sm">
            {Number(product.price).toLocaleString()}₫
          </span>
                )}
            </div>
        </Link>
    );
}
