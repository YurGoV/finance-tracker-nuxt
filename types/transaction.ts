export interface ITransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  category: string | null;
}

export interface IAsyncTransactionsResult {
  data: {value: ITransaction[] };
  pending: boolean;
  error: any; // Define the error type accordingly
}
