import { Service } from '../services/service.model';
import { Program } from '../programs/program.model';
import { Blog } from '../blogs/blog.model';
import { Review } from '../reviews/review.model';
import { Contact } from '../contacts/contact.model';

export class DashboardService {
  static async getDashboardData() {
    // 1. Get statistics concurrently
    const [
      activeServicesCount,
      activeProgramsCount,
      publishedBlogsCount,
      activeReviewsCount,
      pendingContactsCount
    ] = await Promise.all([
      Service.countDocuments({ status: 'Active' }),
      Program.countDocuments({ status: 'Active' }),
      Blog.countDocuments({ status: 'Active', publishStatus: 'Published' }),
      Review.countDocuments({ status: 'Active' }),
      Contact.countDocuments({ status: 'PENDING' })
    ]);

    // 2. Get recent content concurrently
    const [recentServices, recentPrograms, recentBlogs, recentReviews, recentContacts] = await Promise.all([
      Service.find().sort({ updatedAt: -1 }).limit(3),
      Program.find().sort({ updatedAt: -1 }).limit(3),
      Blog.find().sort({ updatedAt: -1 }).limit(3),
      Review.find().sort({ updatedAt: -1 }).limit(3),
      Contact.find().sort({ createdAt: -1 }).limit(3)
    ]);

    // 3. Format and combine recent content
    const combinedContent = [
      ...recentServices.map(s => ({
        id: s._id.toString(),
        title: s.title,
        type: 'SERVICE',
        status: s.status,
        createdAt: s.updatedAt || s.createdAt
      })),
      ...recentPrograms.map(p => ({
        id: p._id.toString(),
        title: p.title,
        type: 'PROGRAM',
        status: p.status,
        createdAt: p.updatedAt || p.createdAt
      })),
      ...recentBlogs.map(b => ({
        id: b._id.toString(),
        title: b.title,
        type: 'BLOG',
        status: b.publishStatus,
        createdAt: b.updatedAt || b.createdAt
      })),
      ...recentReviews.map(r => ({
        id: r._id.toString(),
        title: r.name,
        type: 'REVIEW',
        status: r.status,
        createdAt: r.updatedAt || r.createdAt
      })),
      ...recentContacts.map(c => ({
        id: c._id.toString(),
        title: c.fullName,
        type: c.source === 'REGISTRATION' ? 'REGISTRATION' : 'CONTACT',
        status: c.status,
        createdAt: c.createdAt
      }))
    ];

    // Sort by most recently updated and take top 5
    const sortedRecentContent = combinedContent
      .sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime())
      .slice(0, 5);

    return {
      stats: {
        services: activeServicesCount,
        programs: activeProgramsCount,
        blogs: publishedBlogsCount,
        reviews: activeReviewsCount,
        enquiries: pendingContactsCount
      },
      recentContent: sortedRecentContent
    };
  }
}
