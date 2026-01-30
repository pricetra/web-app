import { redirect } from "next/navigation";

export const metadata = {
  title: "Mobile App Download - Pricetra",
  description: "Mobile app download page for Pricetra",
};

export default function MobileAppPage() {
  redirect('/download');
}
