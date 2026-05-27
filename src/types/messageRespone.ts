export interface MentionedUser {
  userId: string;       // uuid
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export interface ChatMessageResponse {
  chatMessageId: string;       // uuid
  content: string;
  senderUserId: string;        // uuid
  senderUsername: string;
  senderFirstName: string;
  senderLastName: string;
  senderProfileImage: string;
  mentionUsers: MentionedUser[]; 
  createdAt: string;          
}