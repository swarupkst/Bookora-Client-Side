export const stats = [
  { title: "Total Users", value: "1,248", change: "+12.5%", type: "users" },
  { title: "Total Books", value: "486", change: "+8.2%", type: "books" },
  { title: "Total Deliveries", value: "864", change: "+15.3%", type: "deliveries" },
  { title: "Total Revenue", value: "৳85,420", change: "+10.8%", type: "revenue" }
];

export const revenueData = [
  { month: "Jan", revenue: 7200 },
  { month: "Feb", revenue: 8400 },
  { month: "Mar", revenue: 7600 },
  { month: "Apr", revenue: 9100 },
  { month: "May", revenue: 10400 },
  { month: "Jun", revenue: 9800 },
  { month: "Jul", revenue: 11500 }
];

export const categoryData = [
  { name: "Fiction", value: 138 },
  { name: "Academic", value: 112 },
  { name: "Programming", value: 91 },
  { name: "Sci-Fi", value: 76 },
  { name: "Others", value: 69 }
];

export const pendingBooks = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    librarian: "Arif Hasan",
    category: "Finance",
    fee: 80,
    status: "Pending Approval"
  },
  {
    id: 2,
    title: "Clean Architecture",
    author: "Robert C. Martin",
    librarian: "Nadia Islam",
    category: "Programming",
    fee: 100,
    status: "Pending Approval"
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    librarian: "Tanvir Ahmed",
    category: "Fiction",
    fee: 60,
    status: "Pending Approval"
  }
];

export const initialUsers = [
  { id: 1, name: "Rahim Uddin", email: "rahim@example.com", role: "user", status: "Active" },
  { id: 2, name: "Nadia Islam", email: "nadia@example.com", role: "librarian", status: "Active" },
  { id: 3, name: "Tanvir Ahmed", email: "tanvir@example.com", role: "librarian", status: "Active" },
  { id: 4, name: "Mim Akter", email: "mim@example.com", role: "user", status: "Active" },
  { id: 5, name: "Sabbir Hossain", email: "sabbir@example.com", role: "user", status: "Suspended" }
];

export const initialBooks = [
  { id: 1, title: "Atomic Habits", librarian: "Nadia Islam", category: "Self Help", status: "Published" },
  { id: 2, title: "Clean Code", librarian: "Tanvir Ahmed", category: "Programming", status: "Published" },
  { id: 3, title: "Deep Work", librarian: "Nadia Islam", category: "Productivity", status: "Unpublished" },
  { id: 4, title: "1984", librarian: "Arif Hasan", category: "Fiction", status: "Published" }
];

export const transactions = [
  { id: "TXN-10021", user: "rahim@example.com", librarian: "nadia@example.com", amount: 80, date: "12 Sep 2026", status: "Paid" },
  { id: "TXN-10020", user: "mim@example.com", librarian: "tanvir@example.com", amount: 100, date: "11 Sep 2026", status: "Paid" },
  { id: "TXN-10019", user: "sabbir@example.com", librarian: "nadia@example.com", amount: 70, date: "10 Sep 2026", status: "Paid" },
  { id: "TXN-10018", user: "nabil@example.com", librarian: "arif@example.com", amount: 60, date: "09 Sep 2026", status: "Paid" }
];
