import VINSearchPage from '@/pages/vin-search.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/check')({
  component: VINSearchPage,
});
