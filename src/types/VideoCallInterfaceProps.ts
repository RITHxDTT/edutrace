import {Participant} from './Participant';
export interface VideoCallInterfaceProps {
  isCamOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  participants: Participant[]; 
}
