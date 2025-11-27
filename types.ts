export type StaffType = 'SWO' | 'SWA' | 'INTERN';

export interface LogEntry {
  id: string;
  timestamp: string; // Date & Time (Automatic)
  patientName: string;
  memberName: string;
  dateOfAdmission: string;
  enrolledDate: string;
  swo: string;
  swa: string;
  intern: string;
  typeOfEntry: 'IP' | 'OP' | 'ER' | '';
  timeframe: 'Within the Day' | 'Within 72 Hours' | 'Beyond 72 Hours' | '';
  phicStatus: 'Enrolled' | 'Re-enrolled' | '';
  remarks: string;
}

export const SWO_LIST = [
  'CHARMAINE', 'ANGELICA', 'LEA MAE', 'PHAIZA', 'JOICAH', 'CHEROKEE',
  'MARIVIC', 'EVANGELINE', 'JUDY ANN', 'BEXY', 'JESSIE', 'RAMONETTE',
  'GEORGIE', 'LHANE', 'DOMINIC', 'KRIS', 'JULITA', 'KATHRINE',
  'MARY JANE H.', 'JOCELYN', 'GENEVIVE', 'MIRIAM', 'MARY JANE T.'
];

export const SWA_LIST = [
  'JONALYN', 'MARY CRIS', 'KARIE', 'ROSELLE', 'JOHN MARK', 'ROBERTSON',
  'BRYAN', 'VERONICA', 'JOY', 'ROCHELLE', 'ROBBIE', 'PATRICK',
  'RONINE', 'EDMOND', 'MICA', 'MARK'
];

export const INTERN_LIST = [
  'DARLENE', 'ZEN', 'JEFF', 'CHAD', 'CARMELA', 'BLESSY', 'JULIE',
  'KRISTINE', 'MADLEYN', 'ROSELLE', 'ROLDAN', 'ZHIENA', 'REIZA', 'KATHERINE'
];

export const ENTRY_TYPES = ['IP', 'OP', 'ER'];
export const PHIC_STATUSES = ['Enrolled', 'Re-enrolled'];
