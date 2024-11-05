/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/Header"
import AddDocumentButton from "@/components/AddDocumentButton";
import { SignedIn, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { getDocuments } from "@/lib/action/room.action";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import DeleteModal from "@/components/DeleteModal";
import Notification from "@/components/Notification";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const cleakUser = await currentUser();

  if (!cleakUser) {
    return (
      <main className="home-container">
        <Header className="sticky left-0 top-0 px-8">
          <Button
            variant="secondary"
          >
            <Link href="/sign-in" className="font-bold">
              Sign in
            </Link>
          </Button>
        </Header>
        <Hero />
      </main>
    )
  }

  const roomDocuments = await getDocuments(cleakUser.emailAddresses[0].emailAddress);

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notification />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All document</h3>
            <AddDocumentButton
              userId={cleakUser.id}
              email={cleakUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link href={`/document/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src="/assets/icons/doc.svg"
                      alt="file"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">
                      Created about {dateConverter(createdAt)}
                    </p>
                  </div>
                </Link>
                <DeleteModal roomId={id} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentButton
            userId={cleakUser.id}
            email={cleakUser.emailAddresses[0].emailAddress}
          />
        </div>
      )
      }
    </main>
  )
}
