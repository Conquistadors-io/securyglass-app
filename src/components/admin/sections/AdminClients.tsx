import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminClients = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des clients à venir...</p>
      </CardContent>
    </Card>
  );
};
