import { addDays, startOfWeek, todayISO } from "./date";
import type {
  Employee,
  Shift,
  TimeEntry,
  TimeEntryStatus,
  WorkforceData,
} from "./types";

/** Deterministic PRNG so a fresh seed always produces the same roster and rotation. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface RosterEntry extends Omit<Employee, "id" | "startDate"> {
  monthsTenure: number;
  /** Weekday indexes (0 = Monday) this person is normally rostered. */
  pattern: number[];
  start: string;
  end: string;
  breakMinutes: number;
}

const ROSTER: RosterEntry[] = [
  {
    firstName: "Marisol",
    lastName: "Vega",
    email: "marisol.vega@bluerise.co",
    phone: "(206) 555-0148",
    role: "Site Supervisor",
    department: "Field Operations",
    homeSite: "Harbor Point Tower",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 46.5,
    weeklyTargetHours: 40,
    certifications: ["OSHA 30", "First Aid/CPR"],
    monthsTenure: 63,
    pattern: [0, 1, 2, 3, 4],
    start: "06:30",
    end: "15:00",
    breakMinutes: 30,
  },
  {
    firstName: "Devon",
    lastName: "Okafor",
    email: "devon.okafor@bluerise.co",
    phone: "(206) 555-0192",
    role: "Crew Lead",
    department: "Field Operations",
    homeSite: "Harbor Point Tower",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 38.75,
    weeklyTargetHours: 40,
    certifications: ["OSHA 30", "Aerial Lift"],
    monthsTenure: 41,
    pattern: [0, 1, 2, 3, 4],
    start: "07:00",
    end: "15:30",
    breakMinutes: 30,
  },
  {
    firstName: "Priya",
    lastName: "Raghunathan",
    email: "priya.raghunathan@bluerise.co",
    phone: "(206) 555-0117",
    role: "Field Technician",
    department: "Field Operations",
    homeSite: "Northgate Campus",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 34.25,
    weeklyTargetHours: 40,
    certifications: ["EPA 608", "Aerial Lift"],
    monthsTenure: 28,
    pattern: [0, 1, 2, 3, 4],
    start: "08:00",
    end: "16:30",
    breakMinutes: 30,
  },
  {
    firstName: "Caleb",
    lastName: "Whitfield",
    email: "caleb.whitfield@bluerise.co",
    phone: "(206) 555-0163",
    role: "Field Technician",
    department: "Field Operations",
    homeSite: "Westline Depot",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 33.0,
    weeklyTargetHours: 40,
    certifications: ["EPA 608"],
    monthsTenure: 19,
    pattern: [1, 2, 3, 4, 5],
    start: "14:00",
    end: "22:30",
    breakMinutes: 30,
  },
  {
    firstName: "Nadia",
    lastName: "Bergström",
    email: "nadia.bergstrom@bluerise.co",
    phone: "(206) 555-0125",
    role: "Dispatcher",
    department: "Dispatch",
    homeSite: "Riverside Logistics Hub",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 31.5,
    weeklyTargetHours: 40,
    certifications: ["Fleet Dispatch Level II"],
    monthsTenure: 34,
    pattern: [0, 1, 2, 3, 4],
    start: "05:30",
    end: "14:00",
    breakMinutes: 30,
  },
  {
    firstName: "Terrence",
    lastName: "Boyle",
    email: "terrence.boyle@bluerise.co",
    phone: "(206) 555-0171",
    role: "Dispatcher",
    department: "Dispatch",
    homeSite: "Riverside Logistics Hub",
    employmentType: "part-time",
    status: "active",
    hourlyRate: 29.0,
    weeklyTargetHours: 24,
    certifications: ["Fleet Dispatch Level I"],
    monthsTenure: 11,
    pattern: [4, 5, 6],
    start: "13:00",
    end: "21:00",
    breakMinutes: 30,
  },
  {
    firstName: "Imani",
    lastName: "Clarke",
    email: "imani.clarke@bluerise.co",
    phone: "(206) 555-0139",
    role: "Safety Inspector",
    department: "Safety & Compliance",
    homeSite: "Northgate Campus",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 41.0,
    weeklyTargetHours: 40,
    certifications: ["OSHA 30", "Confined Space", "First Aid/CPR"],
    monthsTenure: 52,
    pattern: [0, 1, 2, 3],
    start: "07:30",
    end: "17:30",
    breakMinutes: 45,
  },
  {
    firstName: "Hector",
    lastName: "Salas",
    email: "hector.salas@bluerise.co",
    phone: "(206) 555-0186",
    role: "Warehouse Associate",
    department: "Logistics",
    homeSite: "Riverside Logistics Hub",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 27.75,
    weeklyTargetHours: 40,
    certifications: ["Forklift Class II"],
    monthsTenure: 23,
    pattern: [0, 1, 2, 3, 4],
    start: "06:00",
    end: "14:30",
    breakMinutes: 30,
  },
  {
    firstName: "Rosalind",
    lastName: "Amaya",
    email: "rosalind.amaya@bluerise.co",
    phone: "(206) 555-0154",
    role: "Warehouse Associate",
    department: "Logistics",
    homeSite: "Westline Depot",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 28.5,
    weeklyTargetHours: 40,
    certifications: ["Forklift Class II", "Hazmat Handling"],
    monthsTenure: 37,
    pattern: [2, 3, 4, 5, 6],
    start: "15:00",
    end: "23:30",
    breakMinutes: 30,
  },
  {
    firstName: "Jonah",
    lastName: "Feldman",
    email: "jonah.feldman@bluerise.co",
    phone: "(206) 555-0108",
    role: "Facilities Attendant",
    department: "Facilities",
    homeSite: "Harbor Point Tower",
    employmentType: "part-time",
    status: "active",
    hourlyRate: 24.0,
    weeklyTargetHours: 20,
    certifications: ["Bloodborne Pathogens"],
    monthsTenure: 8,
    pattern: [1, 3, 5],
    start: "17:00",
    end: "23:00",
    breakMinutes: 30,
  },
  {
    firstName: "Ayako",
    lastName: "Tanimura",
    email: "ayako.tanimura@bluerise.co",
    phone: "(206) 555-0197",
    role: "Facilities Attendant",
    department: "Facilities",
    homeSite: "Northgate Campus",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 26.25,
    weeklyTargetHours: 40,
    certifications: ["Bloodborne Pathogens", "Chemical Safety"],
    monthsTenure: 44,
    pattern: [0, 1, 2, 3, 4],
    start: "09:00",
    end: "17:30",
    breakMinutes: 30,
  },
  {
    firstName: "Marcus",
    lastName: "Delacroix",
    email: "marcus.delacroix@bluerise.co",
    phone: "(206) 555-0142",
    role: "Field Technician",
    department: "Field Operations",
    homeSite: "Harbor Point Tower",
    employmentType: "contract",
    status: "active",
    hourlyRate: 52.0,
    weeklyTargetHours: 32,
    certifications: ["EPA 608", "High Voltage"],
    monthsTenure: 5,
    pattern: [0, 2, 4, 5],
    start: "08:30",
    end: "17:00",
    breakMinutes: 45,
  },
  {
    firstName: "Sylvia",
    lastName: "Grant",
    email: "sylvia.grant@bluerise.co",
    phone: "(206) 555-0113",
    role: "Crew Lead",
    department: "Logistics",
    homeSite: "Westline Depot",
    employmentType: "full-time",
    status: "on-leave",
    hourlyRate: 37.0,
    weeklyTargetHours: 40,
    certifications: ["Forklift Class II", "OSHA 10"],
    monthsTenure: 71,
    pattern: [],
    start: "07:00",
    end: "15:30",
    breakMinutes: 30,
  },
  {
    firstName: "Oren",
    lastName: "Baptiste",
    email: "oren.baptiste@bluerise.co",
    phone: "(206) 555-0179",
    role: "Field Technician",
    department: "Field Operations",
    homeSite: "Westline Depot",
    employmentType: "full-time",
    status: "active",
    hourlyRate: 35.5,
    weeklyTargetHours: 40,
    certifications: ["EPA 608", "Confined Space"],
    monthsTenure: 30,
    pattern: [2, 3, 4, 5, 6],
    start: "06:00",
    end: "16:30",
    breakMinutes: 45,
  },
];

interface OpenShiftTemplate {
  dayOffset: number;
  start: string;
  end: string;
  breakMinutes: number;
  role: string;
  site: string;
  notes: string;
}

const OPEN_SHIFTS: OpenShiftTemplate[] = [
  {
    dayOffset: 1,
    start: "22:00",
    end: "06:00",
    breakMinutes: 45,
    role: "Field Technician",
    site: "Riverside Logistics Hub",
    notes: "Overnight chiller cutover — needs EPA 608.",
  },
  {
    dayOffset: 3,
    start: "07:00",
    end: "15:30",
    breakMinutes: 30,
    role: "Warehouse Associate",
    site: "Westline Depot",
    notes: "Covering Sylvia Grant's leave.",
  },
  {
    dayOffset: 5,
    start: "08:00",
    end: "16:00",
    breakMinutes: 30,
    role: "Facilities Attendant",
    site: "Harbor Point Tower",
    notes: "Quarterly deep clean, lobby and floors 1–4.",
  },
  {
    dayOffset: 6,
    start: "10:00",
    end: "18:30",
    breakMinutes: 30,
    role: "Safety Inspector",
    site: "Northgate Campus",
    notes: "Pre-audit walkthrough ahead of Monday inspection.",
  },
];

function monthsAgoISO(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}

function shiftTimeBy(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const total = (hours * 60 + mins + minutes + 24 * 60) % (24 * 60);
  return `${`${Math.floor(total / 60)}`.padStart(2, "0")}:${`${total % 60}`.padStart(2, "0")}`;
}

export function buildSeedData(): WorkforceData {
  const random = createRandom(20260426);
  const currentWeek = startOfWeek(todayISO());
  const today = todayISO();

  const employees: Employee[] = ROSTER.map((entry, index) => ({
    id: `emp_${`${index + 1}`.padStart(3, "0")}`,
    firstName: entry.firstName,
    lastName: entry.lastName,
    email: entry.email,
    phone: entry.phone,
    role: entry.role,
    department: entry.department,
    homeSite: entry.homeSite,
    employmentType: entry.employmentType,
    status: entry.status,
    hourlyRate: entry.hourlyRate,
    weeklyTargetHours: entry.weeklyTargetHours,
    startDate: monthsAgoISO(entry.monthsTenure),
    certifications: entry.certifications,
  }));

  const shifts: Shift[] = [];
  const timeEntries: TimeEntry[] = [];
  let shiftCounter = 0;
  let entryCounter = 0;

  // Last week is settled history, this week is live, next week is a published draft.
  const weekOffsets = [-1, 0, 1];

  for (const weekOffset of weekOffsets) {
    const weekStart = addDays(currentWeek, weekOffset * 7);

    ROSTER.forEach((entry, employeeIndex) => {
      const employee = employees[employeeIndex];
      if (employee.status !== "active") return;

      for (const dayIndex of entry.pattern) {
        // Occasional day off keeps the grid from looking machine-generated.
        if (random() < 0.12) continue;

        const date = addDays(weekStart, dayIndex);
        const drift = random() < 0.25 ? (random() < 0.5 ? -30 : 60) : 0;
        const start = entry.start;
        const end = shiftTimeBy(entry.end, drift);

        shiftCounter += 1;
        const shift: Shift = {
          id: `sft_${`${shiftCounter}`.padStart(4, "0")}`,
          employeeId: employee.id,
          date,
          start,
          end,
          breakMinutes: entry.breakMinutes,
          role: entry.role,
          site: entry.homeSite,
          notes: "",
          published: weekOffset <= 0 || random() < 0.7,
        };
        shifts.push(shift);

        if (date >= today) continue;

        // Worked shifts become timesheet entries with small real-world variance.
        const clockIn = shiftTimeBy(start, random() < 0.3 ? 7 : -4);
        const clockOut = shiftTimeBy(end, random() < 0.35 ? 24 : 3);
        const status: TimeEntryStatus =
          weekOffset < 0 ? "approved" : random() < 0.75 ? "pending" : "approved";

        entryCounter += 1;
        timeEntries.push({
          id: `tme_${`${entryCounter}`.padStart(4, "0")}`,
          employeeId: employee.id,
          shiftId: shift.id,
          date,
          clockIn,
          clockOut,
          breakMinutes: entry.breakMinutes,
          status,
          note: "",
        });
      }
    });
  }

  for (const template of OPEN_SHIFTS) {
    shiftCounter += 1;
    shifts.push({
      id: `sft_${`${shiftCounter}`.padStart(4, "0")}`,
      employeeId: null,
      date: addDays(currentWeek, template.dayOffset),
      start: template.start,
      end: template.end,
      breakMinutes: template.breakMinutes,
      role: template.role,
      site: template.site,
      notes: template.notes,
      published: true,
    });
  }

  shifts.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
  timeEntries.sort((a, b) => b.date.localeCompare(a.date) || a.clockIn.localeCompare(b.clockIn));

  return { employees, shifts, timeEntries };
}
