import api from "..";
import type { Transaction } from "@/types/Transaction";

export async function createTransaction(data: Transaction): Promise<any> {
    return await api.post<any>('/transactions', data).then((res) => res.data);
}