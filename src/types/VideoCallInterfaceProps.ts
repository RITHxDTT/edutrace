import {Participant} from './Participant';
export interface VideoCallInterfaceProps {
  isCamOn: boolean;
  isScreenSharing: boolean;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  participants: Participant[]; 
}