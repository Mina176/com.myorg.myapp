interface Employee {
    emp_id: number;
    position: string;
    department: string;
    salary: number;
    attendance: Attendance[];
}

interface Attendance {
    date: Date;
    present: boolean;
}