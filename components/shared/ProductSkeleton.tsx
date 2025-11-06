import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/3" />
      </CardFooter>
    </Card>
  );
}