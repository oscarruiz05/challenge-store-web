import api from "..";
import type { Product } from "@/types/Product";

export async function getProducts(): Promise<Product[]> {
    return await api.get('/products').then((res) => res.data);
}