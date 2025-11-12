import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminArticles = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des articles à venir...</p>
      </CardContent>
    </Card>
  );
};
