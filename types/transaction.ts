export interface ITransaction {
  id: String;
  amount: Number;
  type: String;
  description: String | null;
  category: String | null;
  created_at: Date;
}

export interface IAsyncTransactionsResult {
  data: {value: ITransaction[] };
  pending: boolean;
  error: any; // Define the error type accordingly
}
