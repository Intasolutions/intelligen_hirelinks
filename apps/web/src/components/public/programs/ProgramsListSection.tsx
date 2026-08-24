import { ProgramsService } from '../../../services/programs.service';
import { ProgramsListCarousel, type ProgramListItem } from './ProgramsListCarousel';

export async function ProgramsListSection() {
  let programs: ProgramListItem[] = [];

  try {
    const res = await ProgramsService.getPublicPrograms();
    programs = (res.data ?? []) as ProgramListItem[];
  } catch {
    // Public section — fail quietly rather than breaking the whole page if
    // the API is unreachable; the list just renders nothing.
    programs = [];
  }

  return <ProgramsListCarousel programs={programs} />;
}
