export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

export interface AutoSchedule {
  enabled: boolean;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}
export interface holidayMode {
  holidayMode: boolean;
}
