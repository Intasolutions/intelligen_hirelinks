import { PlacedStudentsService } from '../../../services/placed-students.service';
import { FeaturedStudentsCarousel, type PlacedStudent } from './FeaturedStudentsCarousel';

export async function FeaturedStudentsSection() {
  let students: PlacedStudent[] = [];

  try {
    const res = await PlacedStudentsService.getPublicPlacedStudents();
    students = (res.data ?? []) as PlacedStudent[];
  } catch {
    // Public section — fail quietly rather than breaking the whole About
    // page if the API is unreachable; the carousel just renders nothing.
    students = [];
  }

  return <FeaturedStudentsCarousel students={students} />;
}
