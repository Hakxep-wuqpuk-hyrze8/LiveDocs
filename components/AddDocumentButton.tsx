'use client';

import Image from 'next/image';
import { Button } from './ui/button'
import { createDocument } from '@/lib/action/room.action';
import { useRouter } from 'next/navigation';

export default function AddDocumentButton({ userId, email }: AddDocumentBtnProps) {
  const route = useRouter();

  const addDocumentButtonHandler = async () => {
    try {
      const room = await createDocument({ userId, email });
      if (room) route.push(`/document/${room.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button
      type="submit"
      className="gradient-blue flex gap-1 shadow-md"
      onClick={addDocumentButtonHandler}
    >
      <Image
        src="/assets/icons/add.svg"
        alt="add"
        width={24}
        height={24}
      />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  )
}
