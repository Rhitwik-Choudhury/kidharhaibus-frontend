// Mock data for KidharHaiBus application

export const mockStudents = [
  {
    id: '1',
    name: 'Ananya Sharma',
    class: '5A',
    rollNo: '15',
    busRoute: 'Route A - Malviya Nagar',
    currentStatus: 'On Bus',
    pickupTime: '07:30 AM',
    dropTime: '02:30 PM',
    driverContact: '+91 6000407957'
  },
  {
    id: '2',
    name: 'Arjun Patel',
    class: '3B',
    rollNo: '22',
    busRoute: 'Route B - Sector 18',
    currentStatus: 'Picked Up',
    pickupTime: '07:45 AM',
    dropTime: '02:45 PM',
    driverContact: '+91 9876543211'
  }
];

export const mockTrips = [
  {
    id: '1',
    date: '2025-01-15',
    route: 'Route A - Malviya Nagar',
    startTime: '07:00 AM',
    endTime: '08:30 AM',
    studentsCount: 28,
    status: 'Completed',
    driver: 'Rajesh Kumar'
  },
  {
    id: '2',
    date: '2025-01-15',
    route: 'Route A - Malviya Nagar',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    studentsCount: 25,
    status: 'In Progress',
    driver: 'Rajesh Kumar'
  }
];

export const mockAlerts = [
  {
    id: '1',
    type: 'pickup',
    message: 'Ananya has been picked up from her stop',
    time: '07:32 AM',
    student: 'Ananya Sharma',
    read: false
  },
  {
    id: '2',
    type: 'emergency',
    message: 'Bus breakdown reported on Route B',
    time: '08:15 AM',
    priority: 'high',
    read: false
  },
  {
    id: '3',
    type: 'arrival',
    message: 'Bus reached school - Ananya arrived safely',
    time: '08:25 AM',
    student: 'Ananya Sharma',
    read: true
  }
];

export const mockBuses = [
  {
    id: '1',
    number: 'DL-8C-1234',
    route: 'Route A - Malviya Nagar',
    driver: 'Rajesh Kumar',
    capacity: 35,
    currentOccupancy: 28,
    status: 'Active',
    location: 'Near Lotus Temple',
    lastUpdated: '2 mins ago'
  },
  {
    id: '2',
    number: 'DL-8C-5678',
    route: 'Route B - Sector 18',
    driver: 'Suresh Singh',
    capacity: 40,
    currentOccupancy: 32,
    status: 'Maintenance',
    location: 'School Parking',
    lastUpdated: '1 hour ago'
  }
];

export const mockDrivers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 6000407957',
    licenseNo: 'DL-1420110012345',
    experience: '8 years',
    rating: 4.8,
    assignedRoute: 'Route A - Malviya Nagar',
    status: 'On Duty'
  },
  {
    id: '2',
    name: 'Suresh Singh',
    phone: '+91 9876543211',
    licenseNo: 'DL-1420110012346',
    experience: '12 years',
    rating: 4.9,
    assignedRoute: 'Route B - Sector 18',
    status: 'Off Duty'
  }
];

export const mockRoutes = [
  {
    id: '1',
    name: 'Route A - Malviya Nagar',
    stops: [
      { name: 'School', time: '07:00 AM', coordinates: [28.5535, 77.2588] },
      { name: 'Malviya Nagar Metro', time: '07:15 AM', coordinates: [28.5362, 77.2059] },
      { name: 'Saket Mall', time: '07:25 AM', coordinates: [28.5244, 77.2066] },
      { name: 'Select City Walk', time: '07:35 AM', coordinates: [28.5244, 77.2066] }
    ],
    totalDistance: '12 km',
    estimatedTime: '45 mins'
  }
];

export const mockCurrentLocation = {
  busId: '1',
  lat: 28.5535,
  lng: 77.2588,
  speed: 25,
  direction: 'Northeast',
  nextStop: 'Malviya Nagar Metro',
  eta: '8 mins'
};

// Auth mock data
export const mockUsers = {
  parents: [
    {
      id: '1',
      name: 'Priya Sharma',
      phone: '+91 9876543200',
      password: 'parent123',
      children: ['1']
    }
  ],
  schools: [
    {
      id: '1',
      schoolName: 'Delhi Public School',
      adminName: 'Dr. Meera Jain',
      phone: '+91 9876543100',
      password: 'school123'
    }
  ],
  drivers: [
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 6000407957',
      password: 'driver123',
      driverCode: 'DRV001'
    }
  ]
};