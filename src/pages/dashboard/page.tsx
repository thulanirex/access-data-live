import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TengaTab from "./components/tenga/TengaTab";
import MobileTab from "./components/mobile/MobileTab";
import NFSTab from "./components/nfs/NFSTab";
import USSDTab from "./components/ussd/USSDTab";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="tenga" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenga">TENGA</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Banking</TabsTrigger>
          <TabsTrigger value="nfs">NFS</TabsTrigger>
          <TabsTrigger value="ussd">USSD *801#</TabsTrigger>
        </TabsList>
        <TabsContent value="tenga" className="space-y-4">
          <TengaTab />
        </TabsContent>
        <TabsContent value="mobile" className="space-y-4">
          <MobileTab />
        </TabsContent>
        <TabsContent value="nfs" className="space-y-4">
          <NFSTab />
        </TabsContent>
        <TabsContent value="ussd" className="space-y-4">
          <USSDTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
