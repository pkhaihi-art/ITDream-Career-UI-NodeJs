import ProductCard from "./ProductCard";

export default function ProductGrid({ title, products }) {
    if (!products?.length) return null;

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}
