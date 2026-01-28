import { redirect } from "next/navigation";

export const metadata = {
  title: "Request Account Deletion - Pricetra",
  description: "Request to delete your Pricetra account by sending an email to our support team..",
};

export default function AccountPage() {
  redirect('/profile/delete-account');
}
