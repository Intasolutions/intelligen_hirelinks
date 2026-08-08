import { ContactInput } from '@hirelinks/contracts';
import { Contact } from './contact.model';

export class ContactEngine {
  static async createPublic(data: ContactInput) {
    const contact = new Contact({
      ...data,
      status: 'PENDING',
      source: data.source || 'REGISTRATION',
    });
    await contact.save();
    return contact;
  }

  static async listContacts(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.search) {
      query.$or = [
        { fullName: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
        { phoneNumber: { $regex: params.search, $options: 'i' } }
      ];
    }

    if (params.status && params.status !== 'All Status') {
      query.status = params.status.toUpperCase();
    }
    
    if (params.source && params.source !== 'All Types') {
      query.source = params.source.toUpperCase();
    }

    const [data, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(query)
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getById(id: string) {
    const contact = await Contact.findById(id);
    if (!contact) throw new Error('Contact not found');
    return contact;
  }

  static async updateStatus(id: string, status: string) {
    const contact = await Contact.findById(id);
    if (!contact) throw new Error('Contact not found');
    
    contact.status = status as any;
    await contact.save();
    return contact;
  }

  static async delete(id: string) {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) throw new Error('Contact not found');
    return true;
  }

  static async getStats() {
    const [total, pending, inProgress, resolved] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'PENDING' }),
      Contact.countDocuments({ status: 'IN_PROGRESS' }),
      Contact.countDocuments({ status: 'RESOLVED' })
    ]);

    return { total, pending, inProgress, resolved };
  }
}
