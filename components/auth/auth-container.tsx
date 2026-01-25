"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { ReactNode } from "react";
import { FaApple } from "react-icons/fa";
import { FaYahoo } from "react-icons/fa6";
import { cn } from "@/lib/utils";
// import { IOSView } from "react-device-detect";

export type AuthContainerProps = {
  title: string;
  buttonLabel: string;
  description?: string;
  error?: string;
  children: ReactNode;
  loading?: boolean;
  extras?: ReactNode;
  onPressSubmit?: () => void;
  onPressApple?: () => void;
  onPressYahoo?: () => void;
  onPressGoogle?: () => void;
};

export default function AuthContainer({
  title,
  buttonLabel,
  description,
  error,
  children,
  loading,
  extras,
  onPressSubmit,
  onPressApple,
  onPressYahoo,
  onPressGoogle,
}: AuthContainerProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-white sm:bg-muted p-5 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 my-10">
          <div className="mb-0 sm:mb-2 flex flex-row justify-center items-center">
            <Link href="/">
              <Image
                src="/logotype_header_black.svg"
                alt="Pricetra"
                width={210}
                height={40}
                className="h-[30px] block w-auto"
                priority
              />
            </Link>
          </div>

          <Card className="border-0 shadow-none sm:border sm:shadow">
            <CardContent className="px-2 py-6 sm:p-6">
              <form className="px-3 py-5 md:px-5 md:py-7">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col mb-3">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {description && (
                      <p className="text-muted-foreground leading-5 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {onPressApple && onPressGoogle && (
                    <>
                      <div className={cn("grid gap-4", onPressYahoo ? "grid-cols-3" : "grid-cols-2")}>
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer bg-white hover:bg-black text-black hover:text-white"
                          onClick={onPressApple}
                          disabled={loading}
                          title={`${buttonLabel} with Apple`}
                        >
                          <FaApple />
                          <span className="sr-only">Apple</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer"
                          onClick={onPressGoogle}
                          disabled={loading}
                          title={`${buttonLabel} with Google`}
                        >
                          <Image
                            src="/icons/google-color-icon.svg"
                            alt="Google"
                            width={210}
                            height={40}
                            className="size-4 block w-auto color-white"
                            priority
                          />
                          <span className="sr-only">Google</span>
                        </Button>
                        {onPressYahoo && <Button
                          variant="outline"
                          className="w-full cursor-pointer hover:bg-yahoo text-yahoo hover:text-white"
                          onClick={onPressYahoo}
                          disabled={loading}
                          title={`${buttonLabel} with Yahoo`}
                        >
                          <FaYahoo />
                          <span className="sr-only">Yahoo</span>
                        </Button>}
                      </div>

                      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                          or continue with
                        </span>
                      </div>
                    </>
                  )}

                  {children}

                  <div className="mt-2">
                    {error && (
                      <div className="mb-2">
                        <p className="text-xs text-red-700">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-pricetra-green-heavy-dark cursor-pointer hover:bg-pricetra-green-heavy-dark hover:opacity-80"
                      onClick={onPressSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <CgSpinner className="animate-spin" />
                      ) : (
                        buttonLabel
                      )}
                    </Button>
                  </div>

                  {extras && extras}
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary text-gray-600"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary text-gray-600"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
