import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgencyBankingResponse } from "@/types/api";

interface Props {
    loading: boolean;
    data: AgencyBankingResponse | null;
}

const AgencyBankingMetricsCards: React.FC<Props> = ({ loading, data }) => {
    if (loading) {
        return (
            <div className="grid gap-4 grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">--</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const metrics = [
        {
            title: "Total Transactions",
            value: data?.total || 0,
            className: "text-blue-600"
        },
        {
            title: "Successful",
            value: data?.success || 0,
            className: "text-green-600"
        },
        {
            title: "Failed",
            value: data?.failed || 0,
            className: "text-red-600"
        },
        {
            title: "Success Rate",
            value: `${data?.percentSuccess || 0}%`,
            className: "text-emerald-600"
        }
    ];

    return (
        <div className="grid gap-4 grid-cols-2">
            {metrics.map((metric) => (
                <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${metric.className}`}>
                            {metric.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AgencyBankingMetricsCards;