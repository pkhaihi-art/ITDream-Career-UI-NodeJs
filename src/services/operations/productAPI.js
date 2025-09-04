import { apiConnector } from "../apiConnector";

const BASE_URL = "http://localhost:8081/v1/product";

// ================ Fetch All Products ================
export const fetchAllProducts = async () => {
    let result = null;

    try {
        const response = await apiConnector("GET", `${BASE_URL}/list`);
        console.log("FETCH_ALL_PRODUCTS RESPONSE............", response);

        // Nếu API không trả về dữ liệu hợp lệ
        if (!response.data) {
            throw new Error("Không nhận được dữ liệu sản phẩm");
        }

        result = response.data;
    } catch (error) {
        console.log("FETCH_ALL_PRODUCTS ERROR............", error);
        result = error?.response?.data || { message: "Không thể tải danh sách sản phẩm" };
    }

    return result;
};

// ================ Fetch Product By ID ================
export const fetchProductById = async (productId) => {
    let result = null;

    try {
        const response = await apiConnector("GET", `${BASE_URL}/${productId}`);
        console.log("FETCH_PRODUCT_BY_ID RESPONSE............", response);

        if (!response.data?.product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        result = response.data.product;
    } catch (error) {
        console.log("FETCH_PRODUCT_BY_ID ERROR............", error);
        result = error?.response?.data || { message: "Không thể tải chi tiết sản phẩm" };
    }

    return result;
};
