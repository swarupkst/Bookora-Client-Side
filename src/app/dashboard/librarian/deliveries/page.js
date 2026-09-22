import Shell from "@/components/librarian/Shell";
import DeliveryTable from "@/components/librarian/DeliveryTable";
export default function Deliveries(){return <Shell><div className="mb-7"><h1 className="text-3xl font-black">Manage Deliveries</h1><p className="mt-2 text-sm text-slate-500">Update requests from Pending → Dispatched → Delivered.</p></div><DeliveryTable/></Shell>}