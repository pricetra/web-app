export const metadata = {
  title: "Request Account Deletion - Pricetra",
  description: "Request to delete your Pricetra account by sending an email to our support team..",
};

export default function AccountPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Page</h1>
      <p>
        In order to delete your account please send us an email at{" "}
        <a href="mailto:it.pricetra@gmail.com?subject=Request Account Deletion" target="_blank" className="font-bold color-sky-700 underline">it.pricetra@gmail.com</a>
      </p>
      <p>
        Once the email is received, we will process your request and delete your account within 24 hours.
      </p>
    </div>
  );
}
