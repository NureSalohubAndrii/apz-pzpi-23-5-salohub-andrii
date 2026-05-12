import CarDetailsPage from '@/pages/car-details.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/vin/$vin')({
  component: CarDetailsPage,
});
