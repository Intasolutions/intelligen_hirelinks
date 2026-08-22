import { ServicesService } from '../../../services/services.service';
import { PopularServicesCarousel, type PopularService } from './PopularServicesCarousel';

export async function PopularServicesSection() {
  let services: PopularService[] = [];

  try {
    const res = await ServicesService.getPublicServices();
    services = (res.data ?? []) as PopularService[];
  } catch {
    // Public section — fail quietly rather than breaking the whole page if
    // the API is unreachable; the list just renders nothing.
    services = [];
  }

  return <PopularServicesCarousel services={services} />;
}
