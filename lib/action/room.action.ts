'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation';
import { withLexicalDocument } from "@liveblocks/node-lexical";

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: 'Untitled',
    }

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write']
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened when creating a room: ${error}`);
  }
};

export const getDocument = async ({ roomId, userId }: { roomId: string, userId: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error('You do not have access to this document!');
    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened when getting a document: ${error}`);
  }
};

export const getDocuments = async (email :string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error happened when getting a rooms: ${error}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const room = await liveblocks.updateRoom(roomId, {
      metadata: {
        title: title
      }
    });
    revalidatePath(`document/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened when updating a document: ${error}`);
  }
};

export const updateDocumentAccess = async ({roomId, email, userType, updatedBy} : ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email] : getAccessType(userType) as AccessType,
    } 

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses
    });

    if (room) {
      const notificationId = nanoid();
      
      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You are been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email
        },
        roomId
      })
    }

    revalidatePath(`/document/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened when updating a document: ${error}`);
  }
};

export const translateDocument = async (roomId: string) => {
  await withLexicalDocument(
    {roomId, client: liveblocks},
    async (doc) => {
      const textContent = doc.getTextContent();
      console.log("textContent: " + textContent);
    }
  );
};

export const removeCollaborator = async ({roomId, email}: {roomId: string, email:string}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error('You cannot remove yourself from the document!');
    }

    const updateRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      }
    });

    revalidatePath(`/document/${roomId}`);
    return parseStringify(updateRoom);
  } catch (error) {
    console.log(`Error happened when remove a collaborator: ${error}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.log(`Error happened when delete a document: ${error}`);
  }
};