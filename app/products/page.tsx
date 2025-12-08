import { redirect } from "next/navigation";

export default async function ProductsBlankPageServer() {
  redirect("/home");
}
